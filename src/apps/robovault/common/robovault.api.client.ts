import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import ROBO_VAULT_DEFINITION from '../robovault.definition';

export type RoboVaultDetails = {
  addr: string;
  chain: string;
  status: string;
  apy: number;
};

@Injectable()
export class RoboVaultApiClient {
  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${ROBO_VAULT_DEFINITION.id}:${network}:vaults`,
    ttl: 30 * 60,
  })
  async getCachedVaults(network: Network) {
    const endpoint = 'https://api.robo-vault.com/vaults';
    const data = await axios.get<RoboVaultDetails[]>(endpoint).then(v => v.data);
    const chainData = data.filter(({ chain, status }) => chain === network && status === 'active');
    return chainData;
  }
}
