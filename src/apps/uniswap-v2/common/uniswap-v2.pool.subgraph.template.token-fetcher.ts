import { Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import { range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
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
  LastBlockSyncedResponse,
  PoolsResponse,
  PoolVolumesResponse,
} from './uniswap-v2.pool.subgraph.types';

export abstract class UniswapV2PoolSubgraphTemplateTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher {
  volumeDataLoader: DataLoader<string, number> | null;

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
    const dataLoaderOptions = { cache: false, maxBatchSize: 1000 };
    this.volumeDataLoader = new DataLoader<string, number>(this.batchGetVolume.bind(this), dataLoaderOptions);

    const chunks = await Promise.all(
      range(0, this.first, 1000).map(skip => {
        const count = Math.min(1000, this.first - skip);
        return this.appToolkit.helpers.theGraphHelper.request<PoolsResponse>({
          endpoint: this.subgraphUrl,
          query: this.poolsQuery,
          variables: { first: count, skip, orderBy: this.orderBy },
        });
      }),
    );

    const poolsData = chunks.flat();
    const poolsByIdData = await this.appToolkit.helpers.theGraphHelper.request<PoolsResponse>({
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
    const volume = this.volumeDataLoader ? await this.volumeDataLoader.load(params.appToken.address) : 0;
    const fees = volume * this.fee;
    const projectedYearlyFees = fees * 365;
    const apy = projectedYearlyFees / dataProps.liquidity;
    return { ...dataProps, volume, apy };
  }

  async batchGetVolume(addresses: string[]) {
    // Get block from 1 day ago
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const block = await provider.getBlockNumber();
    const block1DayAgo = block - BLOCKS_PER_DAY[this.network];

    // Get last block synced on graph; if the graph is not caught up to yesterday, exit early
    const graphMetaData = await this.appToolkit.helpers.theGraphHelper.request<LastBlockSyncedResponse>({
      endpoint: this.subgraphUrl,
      query: this.lastBlockSyncedOnGraphQuery,
    });

    const blockNumberLastSynced = graphMetaData._meta.block.number;
    if (block1DayAgo > blockNumberLastSynced) return [];

    // Retrieve volume data from TheGraph (@TODO Cache this)
    const [volumeByIDData, volumeByIDData1DayAgo] = await Promise.all([
      this.appToolkit.helpers.theGraphHelper.request<PoolVolumesResponse>({
        endpoint: this.subgraphUrl,
        query: this.poolVolumesByIdQuery,
        variables: { ids: addresses },
      }),
      this.appToolkit.helpers.theGraphHelper.request<PoolVolumesResponse>({
        endpoint: this.subgraphUrl,
        query: this.poolVolumesByIdAtBlockQuery,
        variables: { ids: addresses, block: block1DayAgo },
      }),
    ]);

    // Merge all volume data for today and merge all volume data for yesterday
    const poolVolumes = addresses.map(async address => {
      // Find the matching volume entry from yesterday
      const pairVolumeToday = volumeByIDData.pairs.find(p => p.id === address);
      const poolVolumeYesterday = volumeByIDData1DayAgo.pairs.find(p => p.id === address);

      // Calculate volume chnage between yesterday and today wherever applicable
      let volume: number;
      if (pairVolumeToday?.volumeUSD && poolVolumeYesterday?.volumeUSD) {
        const volumeUSDToday = Number(pairVolumeToday.volumeUSD);
        const volumeUSDYesterday = Number(poolVolumeYesterday.volumeUSD);
        volume = volumeUSDToday - volumeUSDYesterday;
      } else if (pairVolumeToday?.untrackedVolumeUSD && poolVolumeYesterday?.untrackedVolumeUSD) {
        const volumeUSDToday = Number(pairVolumeToday.untrackedVolumeUSD);
        const volumeUSDYesterday = Number(poolVolumeYesterday.untrackedVolumeUSD);
        volume = volumeUSDToday - volumeUSDYesterday;
      } else {
        volume = 0;
      }

      return volume;
    });

    return poolVolumes;
  }
}
