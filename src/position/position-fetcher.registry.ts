import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { compact } from 'lodash';

import { CacheOnIntervalOptions, CACHE_ON_INTERVAL_OPTIONS } from '~cache/cache-on-interval.decorator';
import { CacheOnIntervalService } from '~cache/cache-on-interval.service';
import { Network } from '~types/network.interface';
import { Registry } from '~utils/build-registry';

import { ContractType } from './contract.interface';
import { DefaultDataProps } from './display.interface';
import {
  POSITION_FETCHER_APP,
  POSITION_FETCHER_NETWORK,
  POSITION_FETCHER_GROUP,
  POSITION_FETCHER_TYPE,
  POSITION_FETCHER_OPTIONS,
  PositionOptions,
} from './position-fetcher.decorator';
import { PositionFetcher } from './position-fetcher.interface';
import { PositionFetcherTemplateRegistry } from './position-fetcher.template-registry';
import { AbstractPosition, Position } from './position.interface';

export const buildAppPositionsCacheKey = (opts: {
  type: ContractType;
  network: Network;
  appId: string;
  groupId: string;
}) => `apps-v3:${opts.type}:${opts.network}:${opts.appId}:${opts.groupId}`;

export class PositionFetcherRegistry implements OnApplicationBootstrap {
  private registry: Registry<
    [ContractType, Network, string, string],
    { fetcher: PositionFetcher<Position>; options: PositionOptions }
  > = new Map();

  constructor(
    @Inject(DiscoveryService) private readonly discoveryService: DiscoveryService,
    @Inject(CacheOnIntervalService) private readonly cacheOnIntervalService: CacheOnIntervalService,
    @Inject(PositionFetcherTemplateRegistry)
    private readonly positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry,
  ) {}

  onApplicationBootstrap() {
    /* @TODO: Burn this extreme abomination since we need to guarantee the template registry is built
     * Can be removed when all the position fetchers have been migrated to templates
     */
    this.positionFetcherTemplateRegistry.onModuleInit();
    this.registerPositionFetchers();
    this.registerTemplates();
  }

  private registerTemplates() {
    const templates = this.positionFetcherTemplateRegistry.getAllTemplates();

    for (const template of templates) {
      const type = this.positionFetcherTemplateRegistry.getTemplateType(template);
      this.setToRegistry({
        type,
        appId: template.appId,
        network: template.network,
        groupId: template.groupId,
        fetcher: template,
      });
    }
  }

  private registerPositionFetchers() {
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
        const options = Reflect.getMetadata(POSITION_FETCHER_OPTIONS, wrapper.metatype);

        this.setToRegistry({ type, appId, network, groupId, fetcher: wrapper.instance, options });
      });
  }

  private setToRegistry({
    type,
    appId,
    network,
    groupId,
    fetcher,
    options = {},
  }: {
    type: ContractType;
    appId: string;
    network: Network;
    groupId: string;
    options?: PositionOptions;
    fetcher: PositionFetcher<Position>;
  }) {
    if (!this.registry.get(type)) this.registry.set(type, new Map());
    if (!this.registry.get(type)!.get(network)) this.registry.get(type)!.set(network, new Map());
    if (!this.registry.get(type)!.get(network)!.get(appId))
      this.registry.get(type)!.get(network)!.set(appId, new Map());

    this.registry.get(type)?.get(network)?.get(appId)?.set(groupId, { fetcher, options });

    // Register the position fetcher in the caching module
    const cacheKey = buildAppPositionsCacheKey({ type, network, appId, groupId });
    const cacheOptions: CacheOnIntervalOptions = { key: cacheKey, timeout: 45 * 1000 };
    Reflect.defineMetadata(CACHE_ON_INTERVAL_OPTIONS, cacheOptions, fetcher['getPositions']);
    this.cacheOnIntervalService.registerCache(fetcher, 'getPositions');
  }

  private getOptions({
    type,
    network,
    appId,
    groupId,
  }: {
    type: ContractType;
    network: Network;
    appId: string;
    groupId: string;
  }) {
    const positionWithOptions = this.registry.get(type)?.get(network)?.get(appId)?.get(groupId);
    return positionWithOptions?.options ?? {};
  }

  private getIsExcludedFromTvl(opts: { type: ContractType; network: Network; appId: string; groupId: string }) {
    const template =
      opts.type === ContractType.APP_TOKEN
        ? this.positionFetcherTemplateRegistry.getAppTokenTemplate(opts)
        : this.positionFetcherTemplateRegistry.getContractPositionTemplate(opts);

    if (template) return template.isExcludedFromTvl;
    else return !!this.getOptions(opts).excludeFromTvl;
  }

  getRegisteredTokenGroups() {
    const networkFetchers = this.registry.get(ContractType.APP_TOKEN);
    if (!networkFetchers) return [];

    return Array.from(networkFetchers.entries()).flatMap(([network, appFetchers]) =>
      Array.from(appFetchers.entries()).flatMap(([appId, groupFetchers]) =>
        Array.from(groupFetchers.entries()).flatMap(([groupId]) => ({ network, appId, groupId })),
      ),
    );
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
    const positionFetcher = this.registry.get(type)?.get(network)?.get(appId)?.get(groupId);
    if (!positionFetcher) throw new Error('No position fetcher found');
    return positionFetcher.fetcher as unknown as PositionFetcher<T, V>;
  }

  getGroupIdsForApp({ type, network, appId }: { type: ContractType; network: Network; appId: string }) {
    const appFetchers = this.registry.get(type)?.get(network)?.get(appId);
    return Array.from(appFetchers?.keys() ?? []);
  }

  getTvlEnabledGroupsIds({ network, appId }: { network: Network; appId: string }) {
    const types = [ContractType.APP_TOKEN, ContractType.POSITION] as const;

    const groupIds = types.map(type => {
      const groupIds = this.getGroupIdsForApp({ type, network, appId });
      const tvlEnabledGroupIds = groupIds.filter(
        groupId => !this.getIsExcludedFromTvl({ type, appId, groupId, network }),
      );
      return { type, groupIds: compact(tvlEnabledGroupIds) };
    });

    return groupIds as [
      { type: ContractType.APP_TOKEN; groupIds: string[] },
      { type: ContractType.POSITION; groupIds: string[] },
    ];
  }
}
