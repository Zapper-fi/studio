import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cache from 'file-system-cache';
import { partition, groupBy, map, compact, uniq } from 'lodash';

import { ContractType } from '~position/contract.interface';
import { buildAppPositionsCacheKey, PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { AbstractPosition, AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { AppTokenSelectorKey } from '~position/selectors/app-token-selector.interface';

import { PositionSource } from './position-source.interface';

@Injectable()
export class RegistryPositionSource implements PositionSource {
  private cacheManager = Cache({
    basePath: './.cache',
    ns: '@CacheOnInterval',
  });

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry,
  ) {}

  private getApiResolvedPositions(): string[] {
    return this.configService.get('apiResolvedPositions') ?? [];
  }

  async getTokenDependenciesBatch(queries: AppTokenSelectorKey[]) {
    const networks = uniq(queries.map(query => query.network));
    const groups = this.positionFetcherRegistry.getRegisteredTokenGroups();
    const networkGroups = groups.filter(({ network }) => networks.includes(network));

    const cachedTokenResults = await Promise.all(
      networkGroups.map(async group => {
        const cacheKey = buildAppPositionsCacheKey({ type: ContractType.APP_TOKEN, ...group });
        const cachedData = await this.cacheManager.get(cacheKey);
        return (cachedData as any as AppTokenPosition[]) ?? [];
      }),
    );

    const allTokens = cachedTokenResults.flat();
    return queries.map(q => allTokens.find(t => t.network === q.network && t.address === q.address) ?? null);
  }

  getSupported(definitions: AppGroupsDefinition[], contractType: ContractType) {
    const defs = definitions.flatMap(({ appId, groupIds, network }) =>
      groupIds.map(groupId => {
        const def = { appId, groupId, network, contractType };
        try {
          // Will throw if not found
          this.positionFetcherRegistry.get({ type: contractType, appId, groupId, network });
          const isLocallyProvided = !this.getApiResolvedPositions().includes(appId);
          return { ...def, supported: isLocallyProvided };
        } catch (e) {
          return { ...def, supported: false };
        }
      }),
    );

    const partionedDefs = partition(defs, def => def.supported);

    const [supported, unsupported] = partionedDefs.map(partition => {
      // Group supported and unsupported definitions by app, type, network
      const grouped = groupBy(partition, ({ appId, contractType, network }) =>
        [appId, contractType, network].join(':'),
      );

      // Rebuild the group definitions to have groupIds instead of one definition per group ID
      return map(grouped, group => {
        const def = group[0];
        return {
          appId: def.appId,
          network: def.network,
          contractType: def.contractType,
          groupIds: group.map(({ groupId }) => groupId),
        };
      });
    });

    return { supported, unsupported };
  }

  async getPositions<T extends AbstractPosition<any>>(
    definitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]> {
    if (!definitions.length) return [];

    const fetchers = definitions.flatMap(({ appId, groupIds, network }) =>
      groupIds.map(groupId => {
        try {
          return this.positionFetcherRegistry.get({ type: contractType, appId, groupId, network });
        } catch (e) {
          return null;
        }
      }),
    );

    const validFetchers = compact(fetchers);
    const positions = (await Promise.all(
      validFetchers.map(async fetcher => (await fetcher.getPositions()) ?? []),
    )) as T[][];

    return positions.flat();
  }
}
