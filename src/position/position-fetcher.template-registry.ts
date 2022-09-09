import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { uniq } from 'lodash';

import { Erc20 } from '~contract/contracts';
import { Network } from '~types/network.interface';
import { buildTemplateRegistry } from '~utils/build-template-registry';

import { ContractType } from './contract.interface';
import { AppTokenTemplatePositionFetcher } from './template/app-token.template.position-fetcher';
import { ContractPositionTemplatePositionFetcher } from './template/contract-position.template.position-fetcher';

type Template = AppTokenTemplatePositionFetcher<Erc20> | ContractPositionTemplatePositionFetcher<Erc20>;

@Injectable()
export class PositionFetcherTemplateRegistry implements OnModuleInit {
  private appTokenTemplateRegistry = new Map<
    string,
    Map<Network, Map<string, AppTokenTemplatePositionFetcher<Erc20>>>
  >();

  private contractPositionTemplateRegistry = new Map<
    string,
    Map<Network, Map<string, ContractPositionTemplatePositionFetcher<Erc20>>>
  >();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    console.log('CALLED ON MODULE INIT');

    this.appTokenTemplateRegistry = buildTemplateRegistry(this.discoveryService, {
      template: AppTokenTemplatePositionFetcher,
      keySelector: t => [t.appId, t.network, t.groupId] as const,
    });

    this.contractPositionTemplateRegistry = buildTemplateRegistry(this.discoveryService, {
      template: ContractPositionTemplatePositionFetcher,
      keySelector: t => [t.appId, t.network, t.groupId] as const,
    });
  }

  getTemplateType(template: Template) {
    return template instanceof AppTokenTemplatePositionFetcher ? ContractType.APP_TOKEN : ContractType.POSITION;
  }

  getAppTokenTemplate({ network, appId, groupId }: { network: Network; appId: string; groupId: string }) {
    return this.appTokenTemplateRegistry.get(appId)?.get(network)?.get(groupId) ?? null;
  }

  getContractPositionTemplate({ network, appId, groupId }: { network: Network; appId: string; groupId: string }) {
    return this.contractPositionTemplateRegistry.get(appId)?.get(network)?.get(groupId) ?? null;
  }

  getTemplatesForApp(appId: string) {
    const appTokenNetworks = Array.from(this.appTokenTemplateRegistry.get(appId)?.keys() ?? []);
    const contractPositionNetworks = Array.from(this.contractPositionTemplateRegistry.get(appId)?.keys() ?? []);
    const networks = uniq([...appTokenNetworks, ...contractPositionNetworks]);

    return networks.flatMap(network => this.getTemplatesForAppOnNetwork(appId, network));
  }

  getAppHasTemplates(appId: string) {
    const appTokenNetworks = Array.from(this.appTokenTemplateRegistry.get(appId)?.keys() ?? []);
    const contractPositionNetworks = Array.from(this.contractPositionTemplateRegistry.get(appId)?.keys() ?? []);
    const networks = uniq([...appTokenNetworks, ...contractPositionNetworks]);

    return networks.some(network => this.getAppHasTemplatesOnNetwork(appId, network));
  }

  getTemplatesForAppOnNetwork(appId: string, network: Network) {
    const appTokenTemplates = this.appTokenTemplateRegistry.get(appId)?.get(network);
    const contractPositionTemplates = this.contractPositionTemplateRegistry.get(appId)?.get(network);
    return [...Array.from(appTokenTemplates?.values() ?? []), ...Array.from(contractPositionTemplates?.values() ?? [])];
  }

  getAppHasTemplatesOnNetwork(appId: string, network: Network) {
    const appTokenTemplates = this.appTokenTemplateRegistry.get(appId)?.get(network);
    const contractPositionTemplates = this.contractPositionTemplateRegistry.get(appId)?.get(network);
    return !!appTokenTemplates || !!contractPositionTemplates;
  }

  getAllTemplates() {
    const appTokenAppIds = Array.from(this.appTokenTemplateRegistry.keys() ?? []);
    const contractAppIds = Array.from(this.contractPositionTemplateRegistry.keys() ?? []);
    const appIds = uniq([...appTokenAppIds, ...contractAppIds]);

    return appIds.flatMap(appId => this.getTemplatesForApp(appId));
  }
}
