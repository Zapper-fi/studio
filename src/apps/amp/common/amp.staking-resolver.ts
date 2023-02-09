import { Injectable } from '@nestjs/common';
import Axios, { AxiosError } from 'axios';

import { Cache } from '~cache/cache.decorator';

interface AmpStakingApiData {
  apps: {
    displayName: string;
    ampPartition: string;
    apy: string;
  }[];
}

interface AmpStakingBalanceData {
  address: string;
  supplyTotal: string;
  rewardTotal: string;
}

@Injectable()
export class AmpStakingResolver {
  @Cache({
    key: `studio:amp:staking:staking-data`,
    ttl: 15 * 60, // 15 minutes
  })
  private async getPoolApyData() {
    const url = 'https://api.capacity.production.flexa.network/apps';
    const { data } = await Axios.get<AmpStakingApiData>(url, {
      headers: { Accept: 'application/vnd.flexa.capacity.v1+json' },
    });

    return data.apps;
  }

  @Cache({
    key: (address: string) => `studio:amp:staking:balance-data:${address}`,
    ttl: 5 * 60, // 15 minutes
  })
  private async getBalanceData(address: string) {
    const url = `https://api.capacity.production.flexa.network/accounts/${address}/totals`;
    const data = await Axios.get<AmpStakingBalanceData>(url, {
      headers: { Accept: 'application/vnd.flexa.capacity.v1+json' },
    })
      .then(({ data }) => data)
      .catch(err => {
        if ((err as AxiosError).response?.data.error === 'Address not found')
          return { address, supplyTotal: '0', rewardTotal: '0' } as AmpStakingBalanceData;
        throw err;
      });

    return data;
  }

  async getBalance(address: string) {
    const balance = await this.getBalanceData(address);

    return {
      address: balance.address,
      supplyTotal: Number(balance.supplyTotal),
      rewardTotal: Number(balance.rewardTotal),
    };
  }

  async getPoolApys(poolName: string) {
    const poolApys = await this.getPoolApyData();

    const poolApy = poolApys.find(x => x.displayName == poolName);
    if (!poolApy) return 0;

    return poolApy.apy;
  }
}
