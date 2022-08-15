import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

import { BALANCE_PRESENTER_APP, BALANCE_PRESENTER_NETWORK } from '~app-toolkit/decorators/balance-presenter.decorator';
import { BALANCE_PRESENTER_GROUP_LABEL } from '~app-toolkit/decorators/group-meta.decorator';
import { Balance, GroupMeta } from '~position/template/balance-presenter.template';
import { Network } from '~types/network.interface';
import { buildRegistry } from '~utils/build-registry';

import { BalancePresenter } from './balance-presenter.interface';

@Injectable()
export class BalancePresenterRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, BalancePresenter>>();
  private groupMetaResolverRegistry = new Map<
    Network,
    Map<string, Map<string, (balances: Balance[]) => Promise<GroupMeta>>>
  >();

  constructor(
    @Inject(DiscoveryService) private readonly discoveryService: DiscoveryService,
    @Inject(MetadataScanner) private readonly metadataScanner: MetadataScanner,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.registry = buildRegistry<[Network, string], BalancePresenter>(this.discoveryService, [
      BALANCE_PRESENTER_NETWORK,
      BALANCE_PRESENTER_APP,
    ]);

    // Build group meta registry
    this.registry.forEach((r, network) => {
      r.forEach((presenter, appId) => {
        this.metadataScanner.scanFromPrototype(presenter, Object.getPrototypeOf(presenter), (methodName: string) => {
          this.registerGroupMeta(presenter, methodName, { network, appId });
        });
      });
    });
  }

  private registerGroupMeta(instance: any, methodName: string, ctx: { network: Network; appId: string }) {
    const methodRef = instance[methodName];
    const groupLabel = this.reflector.get(BALANCE_PRESENTER_GROUP_LABEL, methodRef);
    if (!groupLabel) return;

    if (!this.groupMetaResolverRegistry.get(ctx.network)) this.groupMetaResolverRegistry.set(ctx.network, new Map());
    if (!this.groupMetaResolverRegistry.get(ctx.network)?.get(ctx.appId))
      this.groupMetaResolverRegistry.get(ctx.network)?.set(ctx.appId, new Map());

    this.groupMetaResolverRegistry.get(ctx.network)?.get(ctx.appId)?.set(ctx.appId, methodRef);
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId) ?? null;
  }

  getMetaResolvers(appId: string, network: Network) {
    return this.groupMetaResolverRegistry.get(network)?.get(appId) ?? null;
  }
}
