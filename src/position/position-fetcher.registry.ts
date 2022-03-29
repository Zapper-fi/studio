import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Network } from '~types/network.interface';

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
  private readonly registry = new Map<
    ContractType,
    Map<Network, Map<string, Map<string, PositionFetcher<Position>>>>
  >();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const wrappers = this.discoveryService.getProviders();

    wrappers
      .filter(
        wrapper =>
          wrapper.metatype &&
          Reflect.getMetadata(POSITION_FETCHER_APP, wrapper.metatype) &&
          Reflect.getMetadata(POSITION_FETCHER_NETWORK, wrapper.metatype) &&
          Reflect.getMetadata(POSITION_FETCHER_GROUP, wrapper.metatype) &&
          Reflect.getMetadata(POSITION_FETCHER_TYPE, wrapper.metatype),
      )
      .forEach(wrapper => {
        const type = Reflect.getMetadata(POSITION_FETCHER_TYPE, wrapper.metatype);
        const network = Reflect.getMetadata(POSITION_FETCHER_NETWORK, wrapper.metatype);
        const appId = Reflect.getMetadata(POSITION_FETCHER_APP, wrapper.metatype);
        const groupId = Reflect.getMetadata(POSITION_FETCHER_GROUP, wrapper.metatype);

        if (!this.registry.get(type)) this.registry.set(type, new Map());
        if (!this.registry.get(type)!.get(network)) this.registry.get(type)!.set(network, new Map());
        if (!this.registry.get(type)!.get(network)!.get(appId))
          this.registry.get(type)!.get(network)!.set(appId, new Map());

        this.registry.get(type)?.get(network)?.get(appId)?.set(groupId, wrapper.instance);
      });
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
}
