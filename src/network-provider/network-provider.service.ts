import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { mapValues, snakeCase } from 'lodash';

import { Network } from '~types/network.interface';

import { DEFAULT_REGISTRY } from './network-provider.registry';

@Injectable()
export class NetworkProviderService {
  private providers: Record<Exclude<Network, Network.BITCOIN_MAINNET>, StaticJsonRpcProvider>;

  static getEnvVarKey(network: Network) {
    const snake = snakeCase(network);
    return `${snake.toUpperCase()}_NETWORK_PROVIDER`;
  }

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.providers = mapValues(DEFAULT_REGISTRY, (defaultUrl, network: Network) => {
      const customUrl = configService.get(NetworkProviderService.getEnvVarKey(network));
      return new ethers.providers.StaticJsonRpcProvider(customUrl ?? defaultUrl);
    });
  }

  getProvider(network: Network): StaticJsonRpcProvider {
    if (!this.providers[network]) throw new Error(`No provider found for network "${network}"`);
    return this.providers[network];
  }
}
