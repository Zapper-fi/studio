import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { mapValues, snakeCase } from 'lodash';
import { Chain, HttpTransport, PublicClient, createPublicClient, http } from 'viem';
import {
  arbitrum,
  aurora,
  avalanche,
  base,
  bsc,
  celo,
  cronos,
  evmos,
  fantom,
  gnosis,
  harmonyOne,
  mainnet,
  moonriver,
  optimism,
  polygon,
} from 'viem/chains';

import { Network } from '~types/network.interface';

import { DEFAULT_REGISTRY } from './network-provider.registry';

export const NETWORK_TO_VIEM_CHAIN: Record<Exclude<Network, Network.BITCOIN_MAINNET>, Chain> = {
  [Network.ARBITRUM_MAINNET]: arbitrum,
  [Network.AURORA_MAINNET]: aurora,
  [Network.AVALANCHE_MAINNET]: avalanche,
  [Network.BASE_MAINNET]: base,
  [Network.BINANCE_SMART_CHAIN_MAINNET]: bsc,
  [Network.CELO_MAINNET]: celo,
  [Network.CRONOS_MAINNET]: cronos,
  [Network.ETHEREUM_MAINNET]: mainnet,
  [Network.EVMOS_MAINNET]: evmos,
  [Network.FANTOM_OPERA_MAINNET]: fantom,
  [Network.GNOSIS_MAINNET]: gnosis,
  [Network.HARMONY_MAINNET]: harmonyOne,
  [Network.MOONRIVER_MAINNET]: moonriver,
  [Network.OPTIMISM_MAINNET]: optimism,
  [Network.POLYGON_MAINNET]: polygon,
};

@Injectable()
export class NetworkProviderService {
  private providers: Record<Exclude<Network, Network.BITCOIN_MAINNET>, StaticJsonRpcProvider>;
  private viemProviders: Record<Exclude<Network, Network.BITCOIN_MAINNET>, PublicClient<HttpTransport>>;

  static getEnvVarKey(network: Network) {
    const snake = snakeCase(network);
    return `${snake.toUpperCase()}_NETWORK_PROVIDER`;
  }

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.providers = mapValues(DEFAULT_REGISTRY, (defaultUrl, network: Network) => {
      const customUrl = configService.get(NetworkProviderService.getEnvVarKey(network));
      return new ethers.providers.StaticJsonRpcProvider(customUrl ?? defaultUrl);
    });

    this.viemProviders = mapValues(DEFAULT_REGISTRY, (defaultUrl, network: Network) => {
      const customUrl = configService.get(NetworkProviderService.getEnvVarKey(network));
      return createPublicClient<HttpTransport>({
        chain: NETWORK_TO_VIEM_CHAIN[network],
        transport: http(customUrl ?? defaultUrl),
      });
    });
  }

  getProvider(network: Network): StaticJsonRpcProvider {
    if (!this.providers[network]) throw new Error(`No provider found for network "${network}"`);
    return this.providers[network];
  }

  getViemProvider(network: Network): PublicClient {
    if (!this.viemProviders[network]) throw new Error(`No provider found for network "${network}"`);
    return this.viemProviders[network];
  }
}
