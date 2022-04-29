import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';

type GaugesResponse = {
  address: string;
  network: number;
  pool: {
    id: string;
    address: string;
    poolType: string;
    symbol: string;
    tokens: {
      address: string;
      weight: string;
      symbol: string;
    }[];
  };
  tokenLogoURIs: Record<string, string>;
};

@Injectable()
export class BalancerV2GaugeAddressesGetter {
  constructor() {}

  private githubUri =
    'https://raw.githubusercontent.com/balancer-labs/frontend-v2/ef564fa42779017696b5ab3ed91669952f8bd699/public/data/voting-gauges.json';

  @Cache({
    instance: 'business',
    key: `apps-v3:${BALANCER_V2_DEFINITION.id}:gauges-list`,
    ttl: 30 * 60, // 30 minutes
  })
  private async getAllGauges() {
    const { data } = await axios.get<GaugesResponse[]>(this.githubUri);
    return data;
  }

  async getGauges({ network }: { network: Network }) {
    const data = await this.getAllGauges();

    return data
      .filter(
        ({ address, network: gaugeNetwork }) =>
          NETWORK_IDS[network] === gaugeNetwork &&
          address.toLowerCase() !== '0xe867ad0a48e8f815dc0cda2cdb275e0f163a480b', // Single recipient gauge
      )
      .map(gaugeData => {
        return {
          address: gaugeData.address.toLowerCase(),
          poolId: gaugeData.pool.id,
        };
      });
  }
}
