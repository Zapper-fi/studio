import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { mapValues } from 'lodash';

import { Network } from '~types/network.interface';

import { DEFAULT_REGISTRY } from './network-provider.registry';

@Injectable()
export class NetworkProviderService {
  private providers: Record<Extract<Network, Network.ETHEREUM_MAINNET>, StaticJsonRpcProvider>;

  constructor() {
    this.providers = mapValues(DEFAULT_REGISTRY, url => new ethers.providers.StaticJsonRpcProvider(url));
  }

  getProvider(network: Network): StaticJsonRpcProvider {
    if (!this.providers[network]) throw new Error(`No provider found for network "${network}"`);
    return this.providers[network];
  }
}
