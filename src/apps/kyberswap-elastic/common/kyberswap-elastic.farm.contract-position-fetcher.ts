import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType, Standard } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { KyberswapElasticContractFactory, KyberswapElasticLm } from '../contracts';

import { KyberswapElasticFarmContractPositionBuilder } from './kyberswap-elastic.farm.contract-position-builder';

export type KyberswapElasticFarmPositionDataProps = {
  feeTier: number;
  liquidity: number;
  reserves: number[];
  poolAddress: string;
  assetStandard: Standard.ERC_721;
  rangeStart?: number;
  rangeEnd?: number;
  apy?: number;
};

export type KyberswapElasticFarmPositionDefinition = {
  address: string;
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  rewardTokenAddresses: string[];
  feeTier: number;
};

export abstract class KyberswapElasticFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  KyberswapElasticLm,
  KyberswapElasticFarmPositionDataProps,
  KyberswapElasticFarmPositionDefinition
> {
  abstract kyberswapElasticLmAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapElasticContractFactory) protected readonly contractFactory: KyberswapElasticContractFactory,
    @Inject(KyberswapElasticFarmContractPositionBuilder)
    protected readonly kyberElasticFarmContractPositionBuilder: KyberswapElasticFarmContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KyberswapElasticLm {
    return this.contractFactory.kyberswapElasticLm({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<KyberswapElasticFarmPositionDefinition[]> {
    const kyberswapElasticLmContract = this.contractFactory.kyberswapElasticLm({
      address: this.kyberswapElasticLmAddress,
      network: this.network,
    });

    const poolLengthRaw = await multicall.wrap(kyberswapElasticLmContract).poolLength();

    const definitions = await Promise.all(
      range(0, poolLengthRaw.toNumber()).map(async index => {
        const poolInfos = await multicall.wrap(kyberswapElasticLmContract).getPoolInfo(index);
        const poolContract = this.contractFactory.pool({ address: poolInfos.poolAddress, network: this.network });
        const [token0Raw, token1Raw, feeTier] = await Promise.all([
          multicall.wrap(poolContract).token0(),
          multicall.wrap(poolContract).token1(),
          multicall.wrap(poolContract).swapFeeUnits(),
        ]);

        return {
          address: this.kyberswapElasticLmAddress,
          poolAddress: poolInfos.poolAddress,
          token0Address: token0Raw.toLowerCase(),
          token1Address: token1Raw.toLowerCase(),
          rewardTokenAddresses: poolInfos.rewardTokens,
          feeTier: feeTier,
        };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<KyberswapElasticLm, KyberswapElasticFarmPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token0Address,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token1Address,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(v => ({
        metaType: MetaType.CLAIMABLE,
        address: v,
        network: this.network,
      })),
    ];
  }

  async getDataProps({
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    KyberswapElasticLm,
    KyberswapElasticFarmPositionDataProps,
    KyberswapElasticFarmPositionDefinition
  >): Promise<KyberswapElasticFarmPositionDataProps> {
    const { poolAddress, feeTier } = definition;
    const { tokens } = contractPosition;

    const [reserveRaw0, reserveRaw1] = await Promise.all([
      multicall.wrap(this.contractFactory.erc20(tokens[0])).balanceOf(poolAddress),
      multicall.wrap(this.contractFactory.erc20(tokens[1])).balanceOf(poolAddress),
    ]);

    const reservesRaw = [reserveRaw0, reserveRaw1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
    const liquidity = reserves[0] * tokens[0].price + reserves[1] * tokens[1].price;
    const assetStandard = Standard.ERC_721;

    return { feeTier, reserves, liquidity, poolAddress, assetStandard };
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<
    KyberswapElasticLm,
    KyberswapElasticFarmPositionDataProps,
    KyberswapElasticFarmPositionDefinition
  >): Promise<string> {
    const symbolLabel = contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
    const label = `${symbolLabel} (${definition.feeTier.toFixed(4)}%)`;
    return label;
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<KyberswapElasticFarmPositionDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['feeTier']);
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KyberswapElasticFarmPositionDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const kyberswapElasticLmContract = this.contractFactory.kyberswapElasticLm({
      address: this.kyberswapElasticLmAddress,
      network: this.network,
    });

    const nftIds = await multicall.wrap(kyberswapElasticLmContract).getDepositedNFTs(address);

    const balances = await Promise.all(
      nftIds.map(async nftId => {
        const poolIds = await multicall.wrap(kyberswapElasticLmContract).getJoinedPools(nftId);

        const position = await Promise.all(
          poolIds.map(poolId => {
            return this.kyberElasticFarmContractPositionBuilder.buildPosition({
              positionId: nftId,
              poolId,
              network: this.network,
              multicall,
              tokenLoader,
              kyberswapElasticLmAddress: this.kyberswapElasticLmAddress,
            });
          }),
        );
        return position;
      }),
    );

    return compact(balances.flat());
  }
}
