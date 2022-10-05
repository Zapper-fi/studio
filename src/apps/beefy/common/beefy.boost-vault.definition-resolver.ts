import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type BeefyBostedVaultResponse = {
  id: string;
  tokenAddress: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  status: string;
};

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'bsc',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.AVALANCHE_MAINNET]: 'avax',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
};

@Injectable()
export class BeefyBoostVaultDefinitionsResolver {
  @Cache({
    key: _network => `studio:beefy:${_network}:boost-vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getBoostVaultDefinitionsData(_network: Network) {
    const { data } = await Axios.get<BeefyBostedVaultResponse[]>(
      `https://raw.githubusercontent.com/beefyfinance/beefy-v2/main/src/config/boost/${NETWORK_NAME[_network]}.json`,
    );
    return data;
  }

  async getBoostVaultDefinitions(network: Network) {
    const definitionsDataRaw = await this.getBoostVaultDefinitionsData(network);
    const definitionsData = definitionsDataRaw.filter(x => x.status == 'active' && x.tokenAddress);

    const boostVaultDefinitions = definitionsData.map(t => {
      return {
        address: t.earnContractAddress.toLowerCase(),
        underlyingTokenAddress: t.tokenAddress.toLowerCase(),
        rewardTokenAddress: t.earnedTokenAddress.toLowerCase(),
      };
    });

    return boostVaultDefinitions;
  }
}
