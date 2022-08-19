import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

import { BALANCE_PRODUCT_META_SELECTOR } from '~app-toolkit/decorators/balance-product-meta.decorator';
import { Network } from '~types/network.interface';
import { buildTemplateRegistry } from '~utils/build-template-registry';

import { GroupMeta, PositionPresenterTemplate, ReadonlyBalances } from './template/position-presenter.template';

@Injectable()
export class PositionPresenterRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, PositionPresenterTemplate>>();
  private balanceProductMetaResolverRegistry = new Map<
    Network,
    Map<string, Map<string, (balances: ReadonlyBalances) => Promise<GroupMeta>>>
  >();

  constructor(
    @Inject(DiscoveryService) private readonly discoveryService: DiscoveryService,
    @Inject(MetadataScanner) private readonly metadataScanner: MetadataScanner,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.registry = buildTemplateRegistry(this.discoveryService, {
      template: PositionPresenterTemplate,
      keySelector: t => [t.network, t.appId] as const,
    });

    // Look for balance product metas on each position presenter
    this.registry.forEach(r => {
      r.forEach(presenter => {
        this.metadataScanner.scanFromPrototype(presenter, Object.getPrototypeOf(presenter), (methodName: string) => {
          this.registerBalanceProductMeta(presenter, methodName);
        });
      });
    });
  }

  private registerBalanceProductMeta(instance: PositionPresenterTemplate, methodName: string) {
    const { network, appId } = instance;
    const methodRef = instance[methodName];
    const groupSelector = this.reflector.get(BALANCE_PRODUCT_META_SELECTOR, methodRef);
    if (!groupSelector) return;

    if (!this.balanceProductMetaResolverRegistry.get(network))
      this.balanceProductMetaResolverRegistry.set(network, new Map());
    if (!this.balanceProductMetaResolverRegistry.get(network)?.get(appId))
      this.balanceProductMetaResolverRegistry.get(network)?.set(appId, new Map());

    this.balanceProductMetaResolverRegistry.get(network)?.get(appId)?.set(groupSelector, methodRef);
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId) ?? null;
  }

  getBalanceProductMetaResolvers(appId: string, network: Network) {
    return this.balanceProductMetaResolverRegistry.get(network)?.get(appId) ?? null;
  }
}
