import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import {
  BALANCE_FETCHER_NETWORK,
  BALANCE_FETCHER,
  BALANCE_FETCHER_APP,
} from '~app-toolkit/decorators/balance-fetcher.decorator';
import { Network } from '~types/network.interface';

import { BalanceFetcher } from './balance-fetcher.interface';

@Injectable()
export class AppBalanceFetcherRegistry implements OnModuleInit {
  private readonly registry = new Map<Network, Map<string, BalanceFetcher>>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const wrappers = this.discoveryService.getProviders();

    wrappers
      .filter(
        wrapper =>
          wrapper.metatype &&
          Reflect.getMetadata(BALANCE_FETCHER_NETWORK, wrapper.metatype) &&
          Reflect.getMetadata(BALANCE_FETCHER, wrapper.metatype) &&
          Reflect.getMetadata(BALANCE_FETCHER_APP, wrapper.metatype),
      )
      .forEach(wrapper => {
        const network = Reflect.getMetadata(BALANCE_FETCHER_NETWORK, wrapper.metatype);
        const appId = Reflect.getMetadata(BALANCE_FETCHER_APP, wrapper.metatype);
        if (!this.registry.get(network)) this.registry.set(network, new Map<string, BalanceFetcher>());
        this.registry.get(network)?.set(appId, wrapper.instance);
      });
  }

  get(appId: string, network: Network) {
    const fetcher = this.registry.get(network)?.get(appId);
    if (!fetcher) throw new Error(`No balance fetcher for app ${appId} on network ${network}`);

    return fetcher;
  }
}
