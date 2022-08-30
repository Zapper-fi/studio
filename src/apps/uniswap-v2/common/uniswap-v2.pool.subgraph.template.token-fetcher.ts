import { Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import { range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { UniswapPair, UniswapV2ContractFactory } from '../contracts';

import {
  UniswapV2PoolOnChainTemplateTokenFetcher,
  UniswapV2TokenDataProps,
} from './uniswap-v2.pool.on-chain.template.token-fetcher';
import {
  DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY,
  DEFAULT_POOLS_BY_ID_QUERY,
  DEFAULT_POOLS_QUERY,
  DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY,
  DEFAULT_POOL_VOLUMES_BY_ID_QUERY,
  PoolsResponse,
} from './uniswap-v2.pool.subgraph.types';
import { UniswapV2PoolSubgraphVolumeDataLoader, VolumeData } from './uniswap-v2.pool.subgraph.volume.data-loader';

export abstract class UniswapV2PoolSubgraphTemplateTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher {
  volumeDataLoader: DataLoader<string, VolumeData>;

  abstract subgraphUrl: string;

  // Pool Addresses
  first = 1000;
  orderBy = 'reserveUSD';
  poolsQuery = DEFAULT_POOLS_QUERY;
  poolsByIdQuery = DEFAULT_POOLS_BY_ID_QUERY;
  requiredPools: string[] = [];

  // Volume
  skipVolume = false;
  lastBlockSyncedOnGraphQuery = DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY;
  poolVolumesByIdQuery = DEFAULT_POOL_VOLUMES_BY_ID_QUERY;
  poolVolumesByIdAtBlockQuery = DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  async getAddresses() {
    // Initialize volume dataloader
    const builder = new UniswapV2PoolSubgraphVolumeDataLoader();
    this.volumeDataLoader = builder.generateDataLoader({
      appToolkit: this.appToolkit,
      network: this.network,
      subgraphUrl: this.subgraphUrl,
      lastBlockSyncedOnGraphQuery: this.lastBlockSyncedOnGraphQuery,
      poolVolumesByIdQuery: this.poolVolumesByIdQuery,
      poolVolumesByIdAtBlockQuery: this.poolVolumesByIdAtBlockQuery,
    });

    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const chunks = await Promise.all(
      range(0, this.first, 1000).map(skip => {
        const count = Math.min(1000, this.first - skip);
        return graphHelper.request<PoolsResponse>({
          endpoint: this.subgraphUrl,
          query: this.poolsQuery,
          variables: { first: count, skip, orderBy: this.orderBy },
        });
      }),
    );

    const poolsData = chunks.flat();
    const poolsByIdData = await graphHelper.request<PoolsResponse>({
      endpoint: this.subgraphUrl,
      query: this.poolsByIdQuery,
      variables: { ids: this.requiredPools },
    });

    const pools = poolsData.map(v => v.pairs ?? []).flat();
    const poolsById = poolsByIdData.pairs ?? [];

    const poolIds = [...pools, ...poolsById].map(v => v.id.toLowerCase());
    const uniquepoolIds = uniq(poolIds);
    return uniquepoolIds;
  }

  async getDataProps(params: GetDataPropsParams<UniswapPair, UniswapV2TokenDataProps>) {
    const dataProps = await super.getDataProps(params);
    const { volume, volumeChangePercentage } = this.skipVolume
      ? { volume: 0, volumeChangePercentage: 0 }
      : await this.volumeDataLoader.load(params.appToken.address);
    const projectedYearlyVolume = volume * 365;
    const apy = (projectedYearlyVolume * 100) / dataProps.liquidity;
    return { ...dataProps, volume, volumeChangePercentage, apy };
  }
}
