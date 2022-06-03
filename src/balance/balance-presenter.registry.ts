import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { BALANCE_PRESENTER_APP, BALANCE_PRESENTER_NETWORK } from '~app-toolkit/decorators/balance-presenter.decorator';
import { Network } from '~types/network.interface';
import { buildRegistry } from '~utils/build-registry';

import { BalancePresenter } from './balance-presenter.interface';

@Injectable()
export class BalancePresenterRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, BalancePresenter>>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildRegistry<[Network, string], BalancePresenter>(this.discoveryService, [
      BALANCE_PRESENTER_NETWORK,
      BALANCE_PRESENTER_APP,
    ]);
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId);
  }
}
