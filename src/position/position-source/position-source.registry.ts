import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { partition, groupBy, map, compact } from 'lodash';

import { ContractType } from '~position/contract.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { AbstractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';

import { PositionSource } from './position-source.interface';

@Injectable()
export class RegistryPositionSource implements PositionSource {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry,
  ) {}

  private getApiResolvedPositions(): string[] {
    return this.configService.get('apiResolvedPositions') ?? [];
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
    const positions = (await Promise.all(validFetchers.map(fetcher => fetcher.getPositions()))) as T[][];
    return positions.flat();
  }
}
