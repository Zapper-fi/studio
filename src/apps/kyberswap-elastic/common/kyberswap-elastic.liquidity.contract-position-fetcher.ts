import { Inject, NotImplementedException } from '@nestjs/common';
import DataLoader from 'dataloader';
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

import { KyberswapElasticContractFactory, PositionManager } from '../contracts';

import { KyberswapElasticApyDataLoader } from './kyberswap-elastic.apy.data-loader';
import { KyberswapElasticLiquidityContractPositionBuilder } from './kyberswap-elastic.liquidity.contract-position-builder';
import { GET_TOP_POOLS_QUERY } from './kyberswap-elastic.pool.subgraph.types';

export type KyberswapElasticLiquidityPositionDataProps = {
  feeTier: number;
  liquidity: number;
  reserves: number[];
  poolAddress: string;
  assetStandard: Standard.ERC_721;
  rangeStart?: number;
  rangeEnd?: number;
  apy?: number;
};

export type KyberswapElasticLiquidityPositionDefinition = {
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

export abstract class KyberswapElasticLiquidityContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PositionManager,
  KyberswapElasticLiquidityPositionDataProps,
  KyberswapElasticLiquidityPositionDefinition
> {
  abstract subgraphUrl: string;
  abstract positionManagerAddress: string;
  abstract factoryAddress: string;
  abstract blockSubgraphUrl: string;
  protected poolFeeMapping: Record<string, number> | null;

  apyDataLoader: DataLoader<string, number>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapElasticContractFactory) protected readonly contractFactory: KyberswapElasticContractFactory,
    @Inject(KyberswapElasticLiquidityContractPositionBuilder)
    protected readonly kyberElasticLiquidityContractPositionBuilder: KyberswapElasticLiquidityContractPositionBuilder,
    @Inject(KyberswapElasticApyDataLoader)
    protected readonly apyDataLoaderBuilder: KyberswapElasticApyDataLoader,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PositionManager {
    return this.contractFactory.positionManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<KyberswapElasticLiquidityPositionDefinition[]> {
    this.apyDataLoader = this.apyDataLoaderBuilder.getLoader({
      subgraphUrl: this.subgraphUrl,
      blockSubgraphUrl: this.blockSubgraphUrl,
    });

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
  }: GetTokenDefinitionsParams<PositionManager, KyberswapElasticLiquidityPositionDefinition>) {
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
    KyberswapElasticLiquidityPositionDataProps,
    KyberswapElasticLiquidityPositionDefinition
  >): Promise<KyberswapElasticLiquidityPositionDataProps> {
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
    const apy = await this.apyDataLoader.load(poolAddress);

    return { feeTier, reserves, liquidity, poolAddress, assetStandard, apy };
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<
    PositionManager,
    KyberswapElasticLiquidityPositionDataProps,
    KyberswapElasticLiquidityPositionDefinition
  >): Promise<string> {
    const symbolLabel = contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
    const label = `${symbolLabel} (${definition.feeTier.toFixed(4)}%)`;
    return label;
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<KyberswapElasticLiquidityPositionDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['feeTier']);
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KyberswapElasticLiquidityPositionDataProps>[]> {
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
