import { Inject, NotImplementedException } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { ContractPosition, MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { NETWORK_IDS } from '~types';

import { HomoraBank, HomoraV2ContractFactory } from '../contracts';
import httpClient from '../helpers/httpClient';
import { Exchange, Poolstatus } from '../interfaces/enums';
import { HomoraV2FarmingPositionDataProps, HomoraV2FarmingPositionDefinition, Pool } from '../interfaces/interfaces';

export abstract class HomoraV2FarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
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
    const tradingVolumes = await this.getTradingVolumns();

    return pools
      .filter(
        pool =>
          ![Poolstatus.delisting, Poolstatus.delisted, Poolstatus.emergency_delisted].includes(pool.status!) &&
          !pool.migrateTo,
      )
      .map(pool => ({
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
    return definition.tokenAddresses.map((token: string) => ({ metaType: MetaType.SUPPLIED, address: token }));
  }

  // second label -> pool weight

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    HomoraBank,
    HomoraV2FarmingPositionDataProps,
    HomoraV2FarmingPositionDefinition
  >): Promise<HomoraV2FarmingPositionDataProps> {
    const { poolAddress, feeTier } = definition;

    return {
      poolAddress,
      tradingVolume: definition.tradingVolume,
      feeTier,
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

  getKey({ contractPosition }: { contractPosition: ContractPosition<HomoraV2FarmingPositionDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['feeTier']);
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

  async getTradingVolumns() {
    const chainId = NETWORK_IDS[this.network];
    const { data } = await httpClient.get<Record<string, string>>(`${chainId}/trading-volumes`);
    return data;
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }
}
