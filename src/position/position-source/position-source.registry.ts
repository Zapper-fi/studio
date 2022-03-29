import { Inject, Injectable } from '@nestjs/common';

import { ContractType } from '~position/contract.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { AbstractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';

import { PositionSource } from './position-source.interface';

@Injectable()
export class RegistryPositionSource implements PositionSource {
  constructor(@Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry) {}

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
