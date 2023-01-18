import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { map, merge } from 'lodash'

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type GammaApiTokensResponse = Record<string, object>;

@Injectable()
export class GammaApiHelper {
  constructor() { }

  @Cache({
    key: (network: Network) => `studio:gamma:${network}:vaults`,
    ttl: 60 * 60, // 12 hours
  })
  async getVaultDefinitionsData(urls: string[]) {
    const data = await Promise.all(map(urls, async (url) => {
      const { data } = await Axios.get<GammaApiTokensResponse>(url);
      return data
    }))
    return merge(...data as [GammaApiTokensResponse, GammaApiTokensResponse])
  }
}
