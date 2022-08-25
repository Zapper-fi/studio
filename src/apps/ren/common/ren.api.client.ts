import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

import { REN_DEFINITION } from '../ren.definition';

import { GetAssetsResponse, GetDarknodesResponse, GET_ASSETS_QUERY, GET_DARKNODES_QUERY } from './ren.api.types';

@Injectable()
export class RenApiClient {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: () => `studio:${REN_DEFINITION.id}:${REN_DEFINITION.groups.darknode.id}:assets`,
    ttl: 5 * 60, // 5 minutes
  })
  async getDarknodeAssets() {
    const data = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetAssetsResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/renproject/renvm',
      query: GET_ASSETS_QUERY,
    });

    return data;
  }

  @Cache({
    instance: 'user',
    key: (address: string) => `studio:${REN_DEFINITION.id}:${REN_DEFINITION.groups.darknode.id}:${address}:darknodes`,
    ttl: 5 * 60, // 5 minutes
  })
  async getDarknodeBalance(address: string) {
    const data = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetDarknodesResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/renproject/renvm',
      query: GET_DARKNODES_QUERY,
      variables: {
        address: address.toLowerCase(),
      },
    });

    return data;
  }
}
