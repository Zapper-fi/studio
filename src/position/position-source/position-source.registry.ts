import { Inject, Injectable } from '@nestjs/common';
import { partition, groupBy, map } from 'lodash';

import { ContractType } from '~position/contract.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { AbstractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';

import { PositionSource } from './position-source.interface';

@Injectable()
export class RegistryPositionSource implements PositionSource {
  constructor(@Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry) {}

  getSupported(definitions: AppGroupsDefinition[], contractType: ContractType) {
    const defs = definitions.flatMap(({ appId, groupIds, network }) =>
      groupIds.map(groupId => {
        const def = { appId, groupId, network, contractType };
        try {
          this.positionFetcherRegistry.get({ type: contractType, appId, groupId, network });
          return { ...def, supported: true };
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
    const fetchers = definitions
      .flatMap(({ appId, groupIds, network }) =>
        groupIds.map(groupId => {
          try {
            return this.positionFetcherRegistry.get({ type: contractType, appId, groupId, network });
          } catch (e) {
            return null;
          }
        }),
      )
      .filter((fetcher): fetcher is NonNullable<typeof fetcher> => !!fetcher);

    const positions = (await Promise.all(fetchers.map(fetcher => fetcher.getPositions()))) as T[][];
    return positions.flat();
  }
}
