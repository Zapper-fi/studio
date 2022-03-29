import { Inject, Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';
import { DefaultDataProps } from './display.interface';
import { ApiPositionSource } from './position-source/position-source.api';
import { RegistryPositionSource } from './position-source/position-source.registry';
import { AppTokenPosition, ContractPosition } from './position.interface';

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
  async getAppContractPositions<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.registryPositionSource.getPositions<ContractPosition<T>>(appGroupDefinitions, ContractType.POSITION);
  }

  async getAppTokenPositions<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.registryPositionSource.getPositions<AppTokenPosition<T>>(appGroupDefinitions, ContractType.APP_TOKEN);
  }
}
