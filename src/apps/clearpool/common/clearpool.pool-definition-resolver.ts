import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type ClearpoolApiPoolResponse = {
  address: string;
  currencyName: string;
  currencyAddress: string;
  borrowerName: string;
  poolSize: string;
  utilization: string;
  cpoolAPR: number;
  supplyAPR: number;
  APR: number;
}[];

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

    return definitionsData.map(x => x.address.toLowerCase());
  }
}
