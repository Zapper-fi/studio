import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type ReaperVaultData = {
  data: {
    [key: string]: {
      address: string;
      tokens: {
        lpToken: {
          address: string;
        };
      };
    };
  };
};

const NETWORK_CHAIN_ID_HEX: Partial<Record<Network, string>> = {
  [Network.ARBITRUM_MAINNET]: '0xa4b1',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x38',
  [Network.FANTOM_OPERA_MAINNET]: '0xfa',
  [Network.OPTIMISM_MAINNET]: '0xa',
};

export class ReaperVaultCacheManager {
  @Cache({
    key: (network: Network) => `studio:reaper:${network}:vaults`,
    ttl: 15 * 60, // 15 minutes
  })
  private async getVaultData(network: Network) {
    const chainIdHex = NETWORK_CHAIN_ID_HEX[network];
    const url = `https://2ch9hbg8hh.execute-api.us-east-1.amazonaws.com/dev/api/vaults/${chainIdHex}`;

    const { data } = await Axios.get<ReaperVaultData>(url);
    return data;
  }

  async fetchVaults(network: Network) {
    const vaultData = await this.getVaultData(network);

    return Object.values(vaultData.data).map(vault => {
      return {
        address: vault.address.toLowerCase(),
        underlyingTokenAddress: vault.tokens.lpToken.address.toLowerCase(),
      };
    });
  }
}
