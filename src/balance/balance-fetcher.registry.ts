import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { BALANCE_FETCHER_NETWORK, BALANCE_FETCHER_APP } from '~app-toolkit/decorators/balance-fetcher.decorator';
import { Network } from '~types/network.interface';
import { buildRegistry } from '~utils/build-registry';

import { BalanceFetcher } from './balance-fetcher.interface';

@Injectable()
export class BalanceFetcherRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, BalanceFetcher>>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildRegistry<[Network, string], BalanceFetcher>(this.discoveryService, [
      BALANCE_FETCHER_NETWORK,
      BALANCE_FETCHER_APP,
    ]);
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId);
  }
}
