import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Network } from '~types/network.interface';
import { buildRegistry, Registry } from '~utils/build-registry';

import { ContractType } from './contract.interface';
import { DefaultDataProps } from './display.interface';
import {
  POSITION_FETCHER_APP,
  POSITION_FETCHER_NETWORK,
  POSITION_FETCHER_GROUP,
  POSITION_FETCHER_TYPE,
} from './position-fetcher.decorator';
import { PositionFetcher } from './position-fetcher.interface';
import { AbstractPosition, Position } from './position.interface';

export class PositionFetcherRegistry implements OnModuleInit {
  private registry: Registry<[ContractType, Network, string, string], PositionFetcher<Position>> = new Map();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildRegistry(this.discoveryService, [
      POSITION_FETCHER_TYPE,
      POSITION_FETCHER_NETWORK,
      POSITION_FETCHER_APP,
      POSITION_FETCHER_GROUP,
    ]);
  }

  get<T extends AbstractPosition<V>, V = DefaultDataProps>({
    type,
    network,
    appId,
    groupId,
  }: {
    type: ContractType;
    network: Network;
    appId: string;
    groupId: string;
  }): PositionFetcher<T, V> {
    const fetcher = this.registry.get(type)?.get(network)?.get(appId)?.get(groupId);
    if (!fetcher) throw new Error('No position fetcher found');
    return fetcher as unknown as PositionFetcher<T, V>;
  }

  getGroupIdsForApp({ type, network, appId }: { type: ContractType; network: Network; appId: string }) {
    const appFetchers = this.registry.get(type)?.get(network)?.get(appId);
    return Array.from(appFetchers?.keys() ?? []);
  }
}
