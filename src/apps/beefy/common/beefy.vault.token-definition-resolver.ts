import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type ApyData = Record<string, number>;

type BeefyMarketResponse = {
  id: string;
  name: string;
  token: string;
  tokenAddress: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  network: string;
  status: string;
};

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'bsc',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.AVALANCHE_MAINNET]: 'avax',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.CELO_MAINNET]: 'celo',
  [Network.AURORA_MAINNET]: 'aurora',
};

@Injectable()
export class BeefyVaultTokenDefinitionsResolver {
  @Cache({
    key: _network => `studio:beefy:${_network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getVaultDefinitionsData(_network: Network) {
    const { data } = await Axios.get<BeefyMarketResponse[]>(`https://api.beefy.finance/vaults`);
    const vaultData = data.filter(x => x.network == NETWORK_NAME[_network]);
    return vaultData;
  }

  @Cache({
    key: `studio:beefy:vault-apy`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getVaultApyData() {
    const { data } = await Axios.get<ApyData>(`https://beefy-api.herokuapp.com/apy`);
    return data;
  }

  async getVaultDefinitions(network: Network) {
    const definitionsDataRaw = await this.getVaultDefinitionsData(network);
    const definitionsData = definitionsDataRaw.filter(x => x.status != 'paused' && x.tokenAddress);

    const vaultDefinitions = definitionsData.map(t => {
      return {
        address: t.earnContractAddress.toLowerCase(),
        underlyingAddress: t.tokenAddress.toLowerCase(),
        id: t.id,
        marketName: t.name,
        symbol: t.token,
      };
    });

    return vaultDefinitions;
  }

  async getVaultApys() {
    return await this.getVaultApyData();
  }
}
