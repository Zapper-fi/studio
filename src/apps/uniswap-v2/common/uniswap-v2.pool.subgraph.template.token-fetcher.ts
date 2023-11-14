import DataLoader from 'dataloader';
import { BigNumberish, Contract } from 'ethers';
import { difference, range, uniq } from 'lodash';

import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

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
  FURA_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY,
  LastBlockSyncedFuraResponse,
  LastBlockSyncedResponse,
  PoolsResponse,
  PoolVolumesResponse,
} from './uniswap-v2.pool.subgraph.types';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

export abstract class UniswapV2PoolSubgraphTemplateTokenFetcher<
  T extends Abi,
> extends UniswapV2PoolOnChainTemplateTokenFetcher<T, any> {
  volumeDataLoader: DataLoader<string, number> | null;

  abstract subgraphUrl: string;

  // Pool Addresses
  first = 1000;
  orderBy = 'reserveUSD';
  poolsQuery = DEFAULT_POOLS_QUERY;
  poolsByIdQuery = DEFAULT_POOLS_BY_ID_QUERY;
  requiredPools: string[] = [];
  ignoredPools: string[] = [];

  // Volume
  skipVolume = false;
  lastBlockSyncedOnGraphQuery = DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY;
  poolVolumesByIdQuery = DEFAULT_POOL_VOLUMES_BY_ID_QUERY;
  poolVolumesByIdAtBlockQuery = DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY;

  async getAddresses() {
    // Initialize volume dataloader
    const dataLoaderOptions = { cache: true, maxBatchSize: 1000 };
    if (!this.skipVolume) {
      this.volumeDataLoader = new DataLoader<string, number>(this.batchGetVolume.bind(this), dataLoaderOptions);
    }

    const chunks = await Promise.all(
      range(0, this.first, 1000).map(skip => {
        const count = Math.min(1000, this.first - skip);
        return gqlFetch<PoolsResponse>({
          endpoint: this.subgraphUrl,
          query: this.poolsQuery,
          variables: { first: count, skip, orderBy: this.orderBy },
        });
      }),
    );

    const poolsData = chunks.flat();
    const poolsByIdData = await gqlFetch<PoolsResponse>({
      endpoint: this.subgraphUrl,
      query: this.poolsByIdQuery,
      variables: { ids: this.requiredPools },
    });

    const pools = poolsData.map(v => v.pairs ?? []).flat();
    const poolsById = poolsByIdData.pairs ?? [];

    const poolIds = [...pools, ...poolsById].map(v => v.id.toLowerCase());
    const uniquePoolIds = uniq(poolIds);
    const filteredPoolIds = difference(uniquePoolIds, this.ignoredPools);

    return filteredPoolIds;
  }

  getPoolFactoryContract(_address: string): GetContractReturnType<any, PublicClient> {
    throw new Error('Method not implemented.');
  }

  getPoolsLength(_contract: any): Promise<BigNumberish> {
    throw new Error('Method not implemented.');
  }

  getPoolAddress(_contract: any, _index: number): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async getApy({ appToken }: GetDataPropsParams<T, UniswapV2TokenDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    const volume = this.volumeDataLoader ? await this.volumeDataLoader.load(appToken.address) : 0;
    const yearlyFees = volume * (this.fee / 100) * 365;
    const apy = yearlyFees / liquidity;
    return apy * 100;
  }

  async getDataProps(params: GetDataPropsParams<T, UniswapV2TokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);
    const volume = this.volumeDataLoader ? await this.volumeDataLoader.load(params.appToken.address) : 0;
    return { ...defaultDataProps, volume };
  }

  async batchGetVolume(addresses: string[]) {
    // Get block from 1 day ago
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const block = await provider.getBlockNumber();
    const block1DayAgo = block - BLOCKS_PER_DAY[this.network];
    let blockNumberLastSynced = 0;

    // Get last block synced on graph; if the graph is not caught up to yesterday, exit early
    if (this.subgraphUrl.includes('api.fura.org')) {
      const subgraphName = this.subgraphUrl.substring(this.subgraphUrl.lastIndexOf('/') + 1);
      const graphMetaData = await gqlFetch<LastBlockSyncedFuraResponse>({
        endpoint: this.subgraphUrl,
        query: FURA_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY,
        variables: { subgraphName },
      });

      blockNumberLastSynced = graphMetaData.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
    } else {
      const graphMetaData = await gqlFetch<LastBlockSyncedResponse>({
        endpoint: this.subgraphUrl,
        query: this.lastBlockSyncedOnGraphQuery,
      });

      blockNumberLastSynced = graphMetaData._meta.block.number;
    }

    if (block1DayAgo > blockNumberLastSynced) return addresses.map(() => 0);

    // Retrieve volume data from TheGraph (@TODO Cache this)
    const [volumeByIDData, volumeByIDData1DayAgo] = await Promise.all([
      gqlFetch<PoolVolumesResponse>({
        endpoint: this.subgraphUrl,
        query: this.poolVolumesByIdQuery,
        variables: { ids: addresses },
      }),
      gqlFetch<PoolVolumesResponse>({
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
