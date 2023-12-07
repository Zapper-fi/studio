import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type RoboVaultDetails = {
  addr: string;
  chain: string;
  status: string;
  apy: number;
};

@Injectable()
export class RoboVaultApiClient {
  @Cache({
    key: (network: Network) => `studio:robovault:${network}:vaults`,
    ttl: 30 * 60,
  })
  async getCachedVaults(network: Network) {
    const endpoint = 'https://api.v2.robo-vault.com/vaults';
    const data = await axios.get<RoboVaultDetails[]>(endpoint).then(v => v.data);
    const chainData = data.filter(({ chain, status }) => chain === network && status === 'active');
    return chainData;
  }
}
