import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Network } from '~types/network.interface';
import { buildTemplateRegistry } from '~utils/build-template-registry';

import { PositionPresenterTemplate } from './template/position-presenter.template';

@Injectable()
export class PositionPresenterRegistry implements OnModuleInit {
  private registry = new Map<Network, Map<string, PositionPresenterTemplate>>();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildTemplateRegistry(this.discoveryService, {
      template: PositionPresenterTemplate,
      keySelector: t => [t.network, t.appId] as const,
    });
  }

  get(appId: string, network: Network) {
    return this.registry.get(network)?.get(appId) ?? null;
  }
}
