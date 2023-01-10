import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { Cache } from '~cache/cache.decorator';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isBorrowed } from '~position/position.utils';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network, NETWORK_IDS } from '~types';

import { HomoraBank, HomoraV2ContractFactory } from '../contracts';
import httpClient from '../helpers/httpClient';
import HOMORA_V_2_DEFINITION from '../homora-v2.definition';
import { Exchange, Poolstatus } from '../interfaces/enums';
import {
  HomoraV2FarmingPositionDataProps,
  HomoraV2FarmingPositionDefinition,
  Pool,
  PoolPosition,
} from '../interfaces/interfaces';

export abstract class HomoraV2FarmContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  HomoraBank,
  HomoraV2FarmingPositionDataProps,
  HomoraV2FarmingPositionDefinition
> {
  abstract homoraBankAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HomoraV2ContractFactory) protected readonly contractFactory: HomoraV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HomoraBank {
    return this.contractFactory.homoraBank({ address, network: this.network });
  }

  async getDefinitions(): Promise<HomoraV2FarmingPositionDefinition[]> {
    const pools = await this.getPools();
    const tradingVolumes = await this.getTradingVolumes();

    return pools
      .filter(
        pool =>
          ![Poolstatus.delisting, Poolstatus.delisted, Poolstatus.emergency_delisted].includes(pool.status!) &&
          !pool.migrateTo,
      )
      .map(pool => ({
        key: pool.key,
        address: this.homoraBankAddress,
        exchange: pool.exchange.name,
        poolAddress: pool.lpTokenAddress.toLowerCase(),
        poolName: pool.name,
        tokenAddresses: pool.tokens.map((token: string) => token.toLowerCase()),
        feeTier:
          pool.exchange.name === Exchange.UniswapV3 ? Number(pool.uniswapV3Info?.poolFeeBps) / 10 ** 4 : undefined,
        rewardAddress: pool.rewardAddress,
        tradingVolume: Number(tradingVolumes[pool.key]),
      }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<HomoraBank, HomoraV2FarmingPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.poolAddress,
        network: this.network,
      },
      ...definition.tokenAddresses.map(token => ({
        metaType: MetaType.BORROWED,
        address: token,
        network: this.network,
      })),
    ];
  }

  // second label -> pool weight

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    HomoraBank,
    HomoraV2FarmingPositionDataProps,
    HomoraV2FarmingPositionDefinition
  >): Promise<HomoraV2FarmingPositionDataProps> {
    const { poolAddress, feeTier, key } = definition;

    return {
      key,
      poolAddress,
      tradingVolume: definition.tradingVolume,
      feeTier,
      positionKey: key,
    };
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    HomoraBank,
    HomoraV2FarmingPositionDataProps,
    HomoraV2FarmingPositionDefinition
  >): Promise<string> {
    if (definition.feeTier) {
      const label = `[${definition.exchange}] ${definition.poolName} (${definition.feeTier.toFixed(2)}%)`;
      return label;
    }

    return `[${definition.exchange}] ${definition.poolName}`;
  }

  async getNativeToken() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
    const nativeToken = baseTokens.find(t => t.address === ZERO_ADDRESS);

    return nativeToken;
  }

  async getPools() {
    const chainId = NETWORK_IDS[this.network];
    const { data } = await httpClient.get<Pool[]>(`${chainId}/pools`);
    return data;
  }

  async getTradingVolumes() {
    const chainId = NETWORK_IDS[this.network];
    const { data } = await httpClient.get<Record<string, string>>(`${chainId}/trading-volumes`);
    return data;
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${HOMORA_V_2_DEFINITION.id}:${network}:positions-data`,
    ttl: 3 * 60,
  })
  private async getPositionsData(network: Network) {
    const chainId = NETWORK_IDS[network];
    const { data } = await httpClient.get<PoolPosition[]>(`${chainId}/positions`);
    return data;
  }

  async getBalances(address: string) {
    const data = await this.getPositionsData(this.network);
    const userPositions = data.filter(v => v.owner === address);
    if (!userPositions.length) return [];

    const bankContract = this.contractFactory.homoraBank({ address: this.homoraBankAddress, network: this.network });
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<HomoraV2FarmingPositionDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      userPositions.map(async position => {
        const contractPosition = contractPositions.find(v => v.dataProps.key === position.pool.key);
        if (!contractPosition) return null;

        const [positionInfo, positionDebt] = await Promise.all([
          multicall.wrap(bankContract).getPositionInfo(position.id),
          multicall.wrap(bankContract).getPositionDebts(position.id),
        ]);

        const collateralAmount = positionInfo.collateralSize;
        const debtAmounts = contractPosition.tokens.filter(isBorrowed).map(t => {
          const debtArrayIndex = positionDebt.tokens.findIndex(dt => dt.toLowerCase() === t.address);
          return debtArrayIndex >= 0 ? positionDebt.debts[debtArrayIndex].toString() : '0';
        });

        const amounts = [collateralAmount, ...debtAmounts];
        const allTokens = contractPosition.tokens.map((t, i) =>
          drillBalance(t, amounts[i]?.toString() ?? '0', { isDebt: t.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const balance: ContractPositionBalance<HomoraV2FarmingPositionDataProps> = {
          ...contractPosition,
          tokens,
          balanceUSD,
        };

        return balance;
      }),
    );

    return compact(balances);
  }
}
