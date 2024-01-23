import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';

import { GetAssetsResponse, GetDarknodesResponse, GET_ASSETS_QUERY, GET_DARKNODES_QUERY } from './ren.api.types';

@Injectable()
export class RenApiClient {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: () => `studio:ren:darknode:assets`,
    ttl: 5 * 60, // 5 minutes
  })
  async getDarknodeAssets() {
    const data = await gqlFetch<GetAssetsResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/renproject/renvm?source=zapper',
      query: GET_ASSETS_QUERY,
    });

    return data;
  }

  @Cache({
    key: (address: string) => `studio:ren:darknode:${address}:darknodes`,
    ttl: 5 * 60, // 5 minutes
  })
  async getDarknodeBalance(address: string) {
    const data = await gqlFetch<GetDarknodesResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/renproject/renvm?source=zapper',
      query: GET_DARKNODES_QUERY,
      variables: {
        address: address.toLowerCase(),
      },
    });

    return data;
  }
}
