import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

export type ETokenDetails = {
  url: string;
  name: string;
  address: string;
  symbol: string;
  pool: string;
  logo: string;
};

export type ETokenAPRDetails = {
  apr: number;
  apy: number;
};

@Injectable()
export class EnsuroApiRegistry {
  @CacheOnInterval({
    key: `studio:ensuro:etokens:etokens-definitions-data`,
    timeout: 5 * 60 * 1000,
    failOnMissingData: false,
  })
  private async getETokenDefinitionsData() {
    const apyUrl = 'https://offchain-v2.ensuro.co/api/etokens/';
    const data = await Axios.get<ETokenDetails[]>(apyUrl).then(v => v.data);
    return data;
  }

  async getETokenDefinitions(opts: { network: Network }) {
    const definitionsData = await this.getETokenDefinitionsData();

    return definitionsData;
  }

  async getETokenApy(opts: { network: Network, address: string }) {
    const apyUrl = `https://offchain-v2.ensuro.co/api/etokens/${opts.address}/apr/?days_from=7`;
    const data = await Axios.get<ETokenAPRDetails>(apyUrl).then(v => v.data);
    return data.apy;
  }
}
