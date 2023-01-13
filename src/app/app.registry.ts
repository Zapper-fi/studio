import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { camelCase, groupBy, keyBy, uniq } from 'lodash';

import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { AppDefinition } from './app.definition';
import { AppAction, AppGroup, GroupType } from './app.interface';

type AnyFetcher =
  | AppTokenTemplatePositionFetcher<any>
  | ContractPositionTemplatePositionFetcher<any>
  | CustomContractPositionTemplatePositionFetcher<any>;

@Injectable()
export class AppRegistry implements OnModuleInit {
  private registry = new Map<string, AppDefinition>();

  constructor(@Inject(DiscoveryService) private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    // Resolve stubs for apps dynamically; in production, static app configurations exist in a database
    const fetchers = await this.resolvePositionFetchers();
    const fetchersByAppId = groupBy(fetchers, fetcher => fetcher.appId);

    const appDefinitions = Object.entries(fetchersByAppId).map(([appId, fetchers]) => {
      const groups = this.resolveAppGroupsFromPositionFetchers(fetchers);
      const supportedNetworks = this.resolveNetworksFromPositionFetchers(fetchers);

      return {
        id: appId,
        name: appId,
        description: '',
        logo: '',
        url: '',
        links: {},
        keywords: [],
        tags: [],
        groups,
        supportedNetworks,
      };
    });

    appDefinitions.forEach(app => this.registry.set(app.id, app));
  }

  resolveAppGroupsFromPositionFetchers(fetchers: AnyFetcher[]) {
    const groups = fetchers.map(
      (template): AppGroup => ({
        type: template instanceof AppTokenTemplatePositionFetcher ? GroupType.TOKEN : GroupType.POSITION,
        id: template.groupId,
        label: template.groupLabel,
      }),
    );

    return keyBy(groups, group => camelCase(group.id));
  }

  resolveNetworksFromPositionFetchers(fetchers: AnyFetcher[]) {
    const networks = fetchers.map(template => template.network);
    return uniq(networks).map(network => ({ network, actions: [AppAction.VIEW] }));
  }

  async resolvePositionFetchers() {
    const wrappers = this.discoveryService.getProviders();

    const searchedClasses = [
      AppTokenTemplatePositionFetcher,
      ContractPositionTemplatePositionFetcher,
      CustomContractPositionTemplatePositionFetcher,
    ];

    const fetchers = wrappers
      .filter(wrapper => wrapper.metatype)
      .filter(wrapper => searchedClasses.some(c => wrapper.instance instanceof c))
      .map(wrapper => wrapper.instance as AnyFetcher);

    return fetchers;
  }

  get(appId: string) {
    return this.registry.get(appId);
  }
}
