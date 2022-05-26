import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { BALANCE_AFTERWARE_APP, BALANCE_AFTERWARE_NETWORK } from '~app-toolkit/decorators/balance-afterware.decorator';
import { Network } from '~types/network.interface';
import { buildRegistry } from '~utils/build-registry';

import { BalanceAfterware } from './balance-afterware.interface';

@Injectable()
export class BalanceAfterwareRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, BalanceAfterware>>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildRegistry<[Network, string], BalanceAfterware>(this.discoveryService, [
      BALANCE_AFTERWARE_NETWORK,
      BALANCE_AFTERWARE_APP,
    ]);
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId);
  }
}
