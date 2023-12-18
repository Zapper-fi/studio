import querystring from 'node:querystring';

import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { NETWORK_IDS, Network } from '~types/network.interface';

const BASE_URL = 'https://api.angle.money/v1';

type TVaultManager = {
  address: string;
};

type TVault = {
  address: string;
  id: number;
};

@Injectable()
export class AnglePositionResolver {
  private async callAngleApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${BASE_URL}/${endpoint}`;
    if (params) {
      url += `?${querystring.stringify(params)}`;
    }
    const data = await Axios.get<T>(url).then(v => v.data);
    return data;
  }

  @Cache({
    key: (network: Network) => `studio:angle:vaultmanagers:${network}:angle`,
    ttl: 15 * 60,
  })
  async getVaultManagers(network: Network) {
    const vaultManagers = await this.callAngleApi<Record<string, TVaultManager>>('vaultManagers', {
      chainId: NETWORK_IDS[network],
    });

    return Object.values(vaultManagers).map(x => x.address);
  }

  @Cache({
    key: (network: Network) => `studio:angle:vaults:${network}:angle`,
    ttl: 15 * 60,
  })
  async getVaultIds(address: string, network: Network) {
    const userVaultDataRaw = await this.callAngleApi<Record<string, TVault>>('vaults', {
      chainId: NETWORK_IDS[network],
      user: address,
    });

    return Object.values(userVaultDataRaw).map(userVault => userVault.id);
  }

  @Cache({
    key: (network: Network) => `studio:angle:rewardsdata:${network}:angle`,
    ttl: 30 * 60,
  })
  async getRewardsData(address: string, network: Network) {
    return this.callAngleApi<{ rewardsData: { totalClaimable: number } }>('dao', {
      chainId: NETWORK_IDS[network],
      user: address,
    });
  }
}
