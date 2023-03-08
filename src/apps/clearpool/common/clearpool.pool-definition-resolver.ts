import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type ClearpoolApiPoolResponse = {
  pools: {
    address: string;
  }[];
};

@Injectable()
export class ClearpoolPoolDefinitionsResolver {
  @Cache({
    key: network => `studio:clearpool:${network}:pool-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getPoolDefinitionsData(network: Network) {
    const { data } = await Axios.get<ClearpoolApiPoolResponse>(
      `https://app.clearpool.finance/api/${NETWORK_IDS[network]}/pools`,
    );
    return data;
  }

  async getPoolDefinitions(network: Network) {
    const definitionsData = await this.getPoolDefinitionsData(network);

    return definitionsData.pools.map(x => x.address.toLowerCase());
  }
}
