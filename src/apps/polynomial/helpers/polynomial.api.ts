import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';

export interface VaultObject {
  tokenAddress: string;
  vaultAddress: string;
  vaultId: string;
  apy: string;
}

@Injectable()
export class PolynomialApiHelper {
  constructor() {}

  private async callApi<T>(path: string): Promise<T> {
    const endpoint = `https://earn-api.polynomial.fi/${path}`;
    const vaults = await Axios.get<T>(endpoint).then(v => v.data);
    return vaults;
  }

  @Cache({
    instance: 'business',
    key: () => `studio:polynomial:vaults`,
    ttl: 15 * 60,
  })
  async getVaults() {
    return this.callApi<VaultObject[]>('vaults');
  }
}
