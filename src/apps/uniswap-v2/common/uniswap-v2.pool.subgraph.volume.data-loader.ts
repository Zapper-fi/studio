import DataLoader from 'dataloader';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { Network } from '~types/network.interface';

import { LastBlockSyncedResponse, PoolVolumesResponse } from './uniswap-v2.pool.subgraph.types';

export type UniswapV2PoolSubgraphVolumeDataLoaderParams = {
  network: Network;
  appToolkit: IAppToolkit;
  subgraphUrl: string;
  lastBlockSyncedOnGraphQuery: string;
  poolVolumesByIdQuery: string;
  poolVolumesByIdAtBlockQuery: string;
};

export type VolumeData = {
  volume: number;
  volumeChangePercentage: number;
};

export class UniswapV2PoolSubgraphVolumeDataLoader {
  generateDataLoader(params: UniswapV2PoolSubgraphVolumeDataLoaderParams) {
    const dataLoaderOptions = { cache: false, maxBatchSize: 1000 };
    return new DataLoader<string, VolumeData>(this.batchGetVolume.bind(this, params), dataLoaderOptions);
  }

  private async batchGetVolume(params: UniswapV2PoolSubgraphVolumeDataLoaderParams, addresses: string[]) {
    const {
      appToolkit,
      network,
      subgraphUrl,
      lastBlockSyncedOnGraphQuery,
      poolVolumesByIdQuery,
      poolVolumesByIdAtBlockQuery,
    } = params;

    // Get block from 1 day ago
    const provider = appToolkit.getNetworkProvider(network);
    const block = await provider.getBlockNumber();
    const block1DayAgo = block - BLOCKS_PER_DAY[network];

    // Get last block synced on graph; if the graph is not caught up to yesterday, exit early
    const graphHelper = appToolkit.helpers.theGraphHelper;
    const graphMetaData = await graphHelper.request<LastBlockSyncedResponse>({
      endpoint: subgraphUrl,
      query: lastBlockSyncedOnGraphQuery,
    });

    const blockNumberLastSynced = graphMetaData._meta.block.number;
    if (block1DayAgo > blockNumberLastSynced) return [];

    // Retrieve volume data from TheGraph (@TODO Cache this)
    const [volumeByIDData, volumeByIDData1DayAgo] = await Promise.all([
      graphHelper.request<PoolVolumesResponse>({
        endpoint: subgraphUrl,
        query: poolVolumesByIdQuery,
        variables: { ids: addresses },
      }),
      graphHelper.request<PoolVolumesResponse>({
        endpoint: subgraphUrl,
        query: poolVolumesByIdAtBlockQuery,
        variables: { ids: addresses, block: block1DayAgo },
      }),
    ]);

    // Merge all volume data for today and merge all volume data for yesterday
    const poolVolumes = addresses.map(async address => {
      // Find the matching volume entry from yesterday
      const pairVolumeToday = volumeByIDData.pairs.find(p => p.id === address);
      const poolVolumeYesterday = volumeByIDData1DayAgo.pairs.find(p => p.id === address);

      // Calculate volume chnage between yesterday and today wherever applicable
      let volume: number, volumeChangePercentage: number;
      if (pairVolumeToday?.volumeUSD && poolVolumeYesterday?.volumeUSD) {
        const volumeUSDToday = Number(pairVolumeToday.volumeUSD);
        const volumeUSDYesterday = Number(poolVolumeYesterday.volumeUSD);
        volume = volumeUSDToday - volumeUSDYesterday;
        volumeChangePercentage = Math.abs(volume / volumeUSDYesterday);
      } else if (pairVolumeToday?.untrackedVolumeUSD && poolVolumeYesterday?.untrackedVolumeUSD) {
        const volumeUSDToday = Number(pairVolumeToday.untrackedVolumeUSD);
        const volumeUSDYesterday = Number(poolVolumeYesterday.untrackedVolumeUSD);
        volume = volumeUSDToday - volumeUSDYesterday;
        volumeChangePercentage = Math.abs(volume / volumeUSDYesterday);
      } else {
        volume = 0;
        volumeChangePercentage = 0;
      }

      return { volume, volumeChangePercentage };
    });

    return poolVolumes;
  }
}
