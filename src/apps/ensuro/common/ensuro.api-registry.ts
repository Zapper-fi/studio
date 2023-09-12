import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';

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
    const { data } = await Axios.get<ETokenDetails[]>(apyUrl);
    return data;
  }

  async getETokenDefinitions() {
    const definitionsData = await this.getETokenDefinitionsData();

    return definitionsData.map(x => x.address.toLowerCase());
  }

  async getETokenApy(address: string) {
    const apyUrl = `https://offchain-v2.ensuro.co/api/etokens/${address}/apr/?days_from=7`;
    const { data } = await Axios.get<ETokenAPRDetails>(apyUrl);
    return data.apy;
  }
}
