import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type BeefyMarketResponse = {
  id: string;
  name: string;
  token: string;
  tokenAddress: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  network: string;
};

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'bsc',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.AVALANCHE_MAINNET]: 'avax',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.ETHEREUM_MAINNET]: 'ethereum',
  [Network.CELO_MAINNET]: 'celo',
  [Network.BASE_MAINNET]: 'base',
};

@Injectable()
export class BeefyVaultTokenDefinitionsResolver {
  @Cache({
    key: _network => `studio:beefy:${_network}:vault-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultDefinitionsData(_network: Network) {
    const { data } = await Axios.get<BeefyMarketResponse[]>(`https://api.beefy.finance/vaults`);
    const vaultData = data.filter(x => x.network == NETWORK_NAME[_network]);
    return vaultData;
  }

  async getVaultDefinitions(network: Network) {
    const definitionsDataRaw = await this.getVaultDefinitionsData(network);

    const vaultDefinitions = definitionsDataRaw.map(t => {
      const tokenAddress = t.tokenAddress?.toLowerCase() ?? ZERO_ADDRESS; // Beefy doesn't have the concept of ZERO address to represent ETH
      return {
        address: t.earnContractAddress.toLowerCase(),
        underlyingAddress:
          (
            {
              arbitrum: {
                '0x5402b5f40310bded796c7d0f3ff6683f5c0cffdf': '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258', // sGLP
              },
              avax: {
                '0xae64d55a6f09e4263421737397d1fdfa71896a69': '0x01234181085565ed162a948b6a5e88758cd7c7b8', // sGLP
              },
            } as Record<string, Record<string, string>>
          )[t.network]?.[tokenAddress] ?? tokenAddress,
        id: t.id,
        marketName: t.name,
        symbol: t.token,
      };
    });

    return vaultDefinitions;
  }
}
