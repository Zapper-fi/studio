import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType, Standard } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { KyberSwapElasticContractFactory, PositionManager } from '../contracts';

import { KyberSwapElasticLiquidityContractPositionBuilder } from './kyberswap-elastic.liquidity.contract-position-builder';
import { KyberSwapElasticPoolStats } from './kyberswap-elastic.liquidity.types';
import { getTimeDayAgo } from './kyberswap-elastic.liquidity.utils';
import {
  POOLs_FEE_HISTORY,
  GET_BLOCKS,
  GET_TOP_POOLS_QUERY,
  GET_POOL_INFO,
} from './kyberswap-elastic.pool.subgraph.types';
export type PoolsFeeResponse = {
  pools?: {
    id: string;
    feesUSD: string;
  }[];
};

export type KyberSwapElasticLiquidityPositionDataProps = {
  feeTier: number;
  liquidity: number;
  reserves: number[];
  poolAddress: string;
  assetStandard: Standard.ERC_721;
  rangeStart?: number;
  rangeEnd?: number;
  apy?: number;
};

export type KyberSwapElasticLiquidityPositionDefinition = {
  address: string;
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  feeTier: number;
};

type GetTopPoolsResponse = {
  pools: {
    id: string;
    feeTier: string;
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
  }[];
};
type GetBlockOneDayAgoResponse = {
  blocks: {
    number: number;
  }[];
};

type GetPoolInfoResponse = {
  pool: {
    id: string;
    feesUSD: number;
    totalValueLockedUSD: number;
  };
};

export abstract class KyberSwapElasticLiquidityContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PositionManager,
  KyberSwapElasticLiquidityPositionDataProps,
  KyberSwapElasticLiquidityPositionDefinition
> {
  abstract subgraphUrl: string;
  abstract positionManagerAddress: string;
  abstract factoryAddress: string;
  abstract blockSubgraphUrl: string;
  protected poolFeeMapping: Record<string, number> | null;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberSwapElasticContractFactory) protected readonly contractFactory: KyberSwapElasticContractFactory,
    @Inject(KyberSwapElasticLiquidityContractPositionBuilder)
    protected readonly kyberElasticLiquidityContractPositionBuilder: KyberSwapElasticLiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PositionManager {
    return this.contractFactory.positionManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<KyberSwapElasticLiquidityPositionDefinition[]> {
    const data = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetTopPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_TOP_POOLS_QUERY,
    });

    return data.pools.map(v => ({
      address: this.positionManagerAddress,
      poolAddress: v.id.toLowerCase(),
      token0Address: v.token0.id.toLowerCase(),
      token1Address: v.token1.id.toLowerCase(),
      feeTier: Number(v.feeTier) / 10 ** 4,
    }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<PositionManager, KyberSwapElasticLiquidityPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.token0Address },
      { metaType: MetaType.SUPPLIED, address: definition.token1Address },
    ];
  }

  async getDataProps({
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    PositionManager,
    KyberSwapElasticLiquidityPositionDataProps,
    KyberSwapElasticLiquidityPositionDefinition
  >): Promise<KyberSwapElasticLiquidityPositionDataProps> {
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
    const apy = await this.getPoolAPY(poolAddress);
    return { feeTier, reserves, liquidity, poolAddress, assetStandard, apy };
  }

  async getPoolAPY(poolAddress: string): Promise<number> {
    const feeUSD24h = await this.getPoolFee24h(poolAddress);
    const poolStats = await this.getPoolStats(poolAddress);

    if (poolStats.feesUSD > 0 && poolStats.tvl > 0) {
      const pool24hFee = poolStats.feesUSD - feeUSD24h;

      return (pool24hFee * 100 * 365) / poolStats.tvl;
    }
    return 0;
  }

  async getPoolStats(poolAddress: string): Promise<KyberSwapElasticPoolStats> {
    const response = await this.appToolkit.helpers.theGraphHelper.request<GetPoolInfoResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOL_INFO,
      variables: {
        id: poolAddress,
      },
    });

    return {
      feesUSD: response.pool.feesUSD,
      tvl: response.pool.totalValueLockedUSD,
    };
  }
  async getBlockOneDayAgo(): Promise<number> {
    const query = GET_BLOCKS([getTimeDayAgo()]);
    const response = await this.appToolkit.helpers.theGraphHelper.request<GetBlockOneDayAgoResponse>({
      endpoint: this.blockSubgraphUrl,
      query: query,
    });

    return Number(response.blocks[0].number);
  }

  async getPoolFee24h(poolAddress: string): Promise<number> {
    if (this.poolFeeMapping == null || this.poolFeeMapping.length === 0) {
      await this.initPoolsFeeLast24h();
    }
    return this.poolFeeMapping ? this.poolFeeMapping[poolAddress] : 0;
  }

  async initPoolsFeeLast24h() {
    const blockNumberOneDayAgo = await this.getBlockOneDayAgo();

    const poolsFeeResponse = await this.appToolkit.helpers.theGraphHelper.request<PoolsFeeResponse>({
      endpoint: this.subgraphUrl,
      query: POOLs_FEE_HISTORY,
      variables: {
        block: blockNumberOneDayAgo,
      },
    });

    const poolFees = poolsFeeResponse.pools ?? [];
    const poolFeeMap = poolFees.reduce((acc: { [id: string]: number }, cur: { id: string; feesUSD: string }) => {
      return {
        ...acc,
        [cur.id]: Number(cur.feesUSD),
      };
    }, {} as { [id: string]: number });
    this.poolFeeMapping = poolFeeMap;
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<
    PositionManager,
    KyberSwapElasticLiquidityPositionDataProps,
    KyberSwapElasticLiquidityPositionDefinition
  >): Promise<string> {
    const symbolLabel = contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
    const label = `${symbolLabel} (${definition.feeTier.toFixed(4)}%)`;
    return label;
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<KyberSwapElasticLiquidityPositionDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['feeTier']);
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KyberSwapElasticLiquidityPositionDataProps>[]> {
    // @TODO: Rely on contract positions when we can correctly index all pools
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const positionManager = this.contractFactory.positionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });

    const numPositionsRaw = await positionManager.balanceOf(address);

    const balances = await Promise.all(
      range(0, numPositionsRaw.toNumber()).map(async index =>
        this.kyberElasticLiquidityContractPositionBuilder.buildPosition({
          positionId: await multicall.wrap(positionManager).tokenOfOwnerByIndex(address, index),
          network: this.network,
          multicall,
          tokenLoader,
        }),
      ),
    );

    return compact(balances);
  }
}
