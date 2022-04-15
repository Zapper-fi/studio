import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Network } from '~types/network.interface';

import { TVL_FETCHER_APP, TVL_FETCHER_NETWORK } from './tvl-fetcher.decorator';
import { TvlFetcher } from './tvl-fetcher.interface';

export class TvlFetcherRegistry implements OnModuleInit {
  private readonly registry = new Map<Network, Map<string, TvlFetcher>>();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const wrappers = this.discoveryService.getProviders();

    wrappers
      .filter(
        wrapper =>
          wrapper.metatype &&
          Reflect.getMetadata(TVL_FETCHER_APP, wrapper.metatype) &&
          Reflect.getMetadata(TVL_FETCHER_NETWORK, wrapper.metatype),
      )
      .forEach(wrapper => {
        const network = Reflect.getMetadata(TVL_FETCHER_NETWORK, wrapper.metatype);
        const appId = Reflect.getMetadata(TVL_FETCHER_APP, wrapper.metatype);

        if (!this.registry.get(network)) this.registry.set(network, new Map());
        this.registry.get(network)?.set(appId, wrapper.instance);
      });
  }

  get({ network, appId }: { network: Network; appId: string }) {
    return this.registry.get(network)?.get(appId);
  }
}
