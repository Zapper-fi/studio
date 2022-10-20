import Axios from 'axios';
import { uniqBy } from 'lodash';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { REAPER_DEFINITION } from '../reaper.definition';

type ReaperCryptsAPIData = {
  data: {
    _id: string;
    provider: string;
    cryptContent: {
      tokens: { name: string; address: string }[];
      name: string;
      pid: number;
      rfSymbol: string;
      fees: {
        depositFee: number;
        withdrawFee: number;
        interestFee: number;
      };
      strategy: {
        address: string;
        abiName: string;
      };
      lpToken: {
        address: string;
        abiName: string;
      };
      vault: {
        address: string;
        abiName: string;
      };
      url: string;
      dead: boolean;
      promo: boolean;
    };
    emissionMultiplier: number;
    analytics: {
      assets: {
        name: string;
        address: string;
        value: number;
      }[];
      tvl: number;
      yields: {
        hour: number;
        day: number;
        week: number;
        month: number;
        threeMonths: number;
        sixMonths: number;
        year: number;
      };
    };
    __v: number;
  }[];
};

export class ReaperVaultCacheManager {
  async getCryptDefinitions(network: Network) {
    if (network === Network.OPTIMISM_MAINNET) return this.getOptimismCryptDefinitions();
    if (network === Network.FANTOM_OPERA_MAINNET) return this.getFantomCryptDefinitions();
    throw new Error('Unsupported network');
  }

  @CacheOnInterval({
    key: `studio:${Network.FANTOM_OPERA_MAINNET}:${REAPER_DEFINITION.id}:${REAPER_DEFINITION.groups.vault.id}:addresses`,
    timeout: 5 * 60 * 1000,
  })
  private async getFantomCryptDefinitions() {
    return this.fetchCryptDefinitions('https://yzo0r3ahok.execute-api.us-east-1.amazonaws.com/dev/api/crypts');
  }

  @CacheOnInterval({
    key: `studio:${Network.OPTIMISM_MAINNET}:${REAPER_DEFINITION.id}:${REAPER_DEFINITION.groups.vault.id}:addresses`,
    timeout: 5 * 60 * 1000,
  })
  private async getOptimismCryptDefinitions() {
    return this.fetchCryptDefinitions('https://yzo0r3ahok.execute-api.us-east-1.amazonaws.com/dev/api/optimism/crypts');
  }

  private async fetchCryptDefinitions(apiUrl: string) {
    const { data } = await Axios.get<ReaperCryptsAPIData>(apiUrl);

    const cryptDefinitions = data.data
      .filter(v => !v.cryptContent.dead)
      .map(v => ({
        name: v.cryptContent.name,
        address: v.cryptContent.vault.address.toLowerCase(),
        underlyingAddress: v.cryptContent.lpToken.address.toLowerCase(),
        apy: v.analytics.yields.year,
      }));

    return uniqBy(cryptDefinitions, v => v.address);
  }
}
