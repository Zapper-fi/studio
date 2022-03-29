import { Inject, Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';
import { DefaultDataProps } from './display.interface';
import { ApiPositionSource } from './position-source/position-source.api';
import { RegistryPositionSource } from './position-source/position-source.registry';
import { AbstractPosition, AppTokenPosition, ContractPosition } from './position.interface';

export type AppGroupsDefinition = {
  appId: string;
  groupIds: string[];
  network: Network;
};

@Injectable()
export class PositionService {
  constructor(
    @Inject(ApiPositionSource) private readonly apiPositionSource: ApiPositionSource,
    @Inject(RegistryPositionSource) private readonly registryPositionSource: RegistryPositionSource,
  ) {}

  private async getPositions<T extends AbstractPosition<any>>(
    appGroupDefinitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]> {
    const { supported, unsupported } = this.registryPositionSource.getSupported(appGroupDefinitions, contractType);

    const positions = await Promise.all([
      this.registryPositionSource.getPositions<T>(supported, contractType),
      this.apiPositionSource.getPositions<T>(unsupported, contractType),
    ]);

    return positions.flat();
  }

  async getAppContractPositions<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.getPositions<ContractPosition<T>>(appGroupDefinitions, ContractType.POSITION);
  }

  async getAppTokenPositions<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.getPositions<AppTokenPosition<T>>(appGroupDefinitions, ContractType.APP_TOKEN);
  }
}
