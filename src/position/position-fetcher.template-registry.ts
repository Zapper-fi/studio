import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Erc20 } from '~contract/contracts';
import { Network } from '~types/network.interface';
import { buildTemplateRegistry } from '~utils/build-template-registry';

import { AppTokenTemplatePositionFetcher } from './template/app-token.template.position-fetcher';
import { ContractPositionTemplatePositionFetcher } from './template/contract-position.template.position-fetcher';

@Injectable()
export class PositionFetcherTemplateRegistry implements OnModuleInit {
  private appTokenTemplateRegistry = new Map<
    Network,
    Map<string, Map<string, AppTokenTemplatePositionFetcher<Erc20>>>
  >();

  private contractPositionTemplateRegistry = new Map<
    Network,
    Map<string, Map<string, ContractPositionTemplatePositionFetcher<Erc20>>>
  >();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.appTokenTemplateRegistry = buildTemplateRegistry(this.discoveryService, {
      template: AppTokenTemplatePositionFetcher,
      keySelector: t => [t.network, t.appId, t.groupId] as const,
    });

    this.contractPositionTemplateRegistry = buildTemplateRegistry(this.discoveryService, {
      template: ContractPositionTemplatePositionFetcher,
      keySelector: t => [t.network, t.appId, t.groupId] as const,
    });
  }

  getAppTokenTemplate({ network, appId, groupId }: { network: Network; appId: string; groupId: string }) {
    return this.appTokenTemplateRegistry.get(network)?.get(appId)?.get(groupId) ?? null;
  }

  getContractPositionTemplate({ network, appId, groupId }: { network: Network; appId: string; groupId: string }) {
    return this.contractPositionTemplateRegistry.get(network)?.get(appId)?.get(groupId) ?? null;
  }

  getTemplatesForApp(appId: string, network: Network) {
    const appTokenTemplates = this.appTokenTemplateRegistry.get(network)?.get(appId);
    const contractPositionTemplates = this.contractPositionTemplateRegistry.get(network)?.get(appId);
    return [...Array.from(appTokenTemplates?.values() ?? []), ...Array.from(contractPositionTemplates?.values() ?? [])];
  }

  getAppHasTemplates(appId: string, network: Network) {
    const appTokenTemplates = this.appTokenTemplateRegistry.get(network)?.get(appId);
    const contractPositionTemplates = this.contractPositionTemplateRegistry.get(network)?.get(appId);
    return !!appTokenTemplates || !!contractPositionTemplates;
  }
}
