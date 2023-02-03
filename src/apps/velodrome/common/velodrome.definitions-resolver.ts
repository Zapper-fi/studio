import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { Cache } from '~cache/cache.decorator';

export interface VelodromeApiPairData {
  address: string;
  symbol: string;
  gauge_address: string;
  token0_address: string;
  token1_address: string;
  apr: number;
  gauge: {
    wrapped_bribe_address: string;
  };
}

@Injectable()
export class VelodromeDefinitionsResolver {
  @Cache({
    key: `studio:velodrome:pool-token-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getPoolDefinitionsData() {
    const url = `https://api.velodrome.finance/api/v1/pairs`;
    const { data } = await Axios.get<{ data: VelodromeApiPairData[] }>(url);

    return data.data;
  }

  async getPoolTokenDefinitions() {
    const definitionsData = await this.getPoolDefinitionsData();

    return definitionsData.map(pool => ({
      address: pool.address.toLowerCase(),
      apy: pool.apr,
    }));
  }

  async getFarmAddresses() {
    const definitionsData = await this.getPoolDefinitionsData();

    return definitionsData.map(pool => pool.gauge_address.toLowerCase()).filter(v => !!v);
  }

  async getBribeDefinitions() {
    const definitionsData = await this.getPoolDefinitionsData();

    const definitionsRaw = definitionsData
      .filter(v => !!v)
      .filter(v => !!v.gauge)
      .map(pool => {
        const wBribeAddress = pool.gauge.wrapped_bribe_address;
        if (wBribeAddress == null) return null;

        return { address: wBribeAddress.toLowerCase(), name: pool.symbol };
      });

    return _.compact(definitionsRaw);
  }
}
