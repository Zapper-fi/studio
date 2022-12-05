import { Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

const GET_POOL_VOLUMES_QUERY = gql`
  query getPoolVolumes($addresses: [String!], $tsYesterday: Int) {
    pools(where: { id_in: $addresses }) {
      id
      totalSwapVolume
      swaps(first: 1, orderBy: "timestamp", orderDirection: "desc", where: { timestamp_lte: $tsYesterday }) {
        poolTotalSwapVolume
      }
    }
  }
`;

type GetPoolVolumesResponse = {
  pools: {
    id: string;
    totalSwapVolume: string;
    swaps: {
      poolTotalSwapVolume: string;
    }[];
  }[];
};

export abstract class BalancerV1PoolSubgraphVolumeDataLoader {
  abstract network: Network;
  abstract subgraphUrl: string;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  getLoader() {
    const dataLoaderOptions = { cache: true, maxBatchSize: 1000 };
    return new DataLoader<string, number>(this.batchGetVolume.bind(this), dataLoaderOptions);
  }

  private async batchGetVolume(addresses: string[]) {
    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;

    const volumeResponse = await this.appToolkit.helpers.theGraphHelper.request<GetPoolVolumesResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOL_VOLUMES_QUERY,
      variables: { tsYesterday, addresses },
    });

    return addresses.map(address => {
      const pool = volumeResponse.pools.find(p => p.id === address);
      if (!pool || !pool.totalSwapVolume.length) return 0;
      return Number(pool.totalSwapVolume) - Number(pool.swaps[0].poolTotalSwapVolume);
    });
  }
}
