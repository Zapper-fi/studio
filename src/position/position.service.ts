import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';
import qs from 'qs';

import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';
import { DefaultDataProps } from './display.interface';
import { AbstractPosition, AppToken, ContractPosition } from './position.interface';

export type AppGroupsDefinition = {
  appId: string;
  groupIds: string[];
  network: Network;
};

@Injectable()
export class PositionService {
  private readonly axios: AxiosInstance;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  private async getPositions<T extends AbstractPosition<any>>(
    definitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]> {
    const pathParam = contractType === ContractType.APP_TOKEN ? 'tokens' : 'contract-positions';
    const { data: positions } = await this.axios.get<T[]>(`/v1/positions/${pathParam}`, {
      params: { definitions: qs.stringify(definitions) },
    });

    return positions;
  }

  async getAppContractPositions<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.getPositions<ContractPosition<T>>(appGroupDefinitions, ContractType.POSITION);
  }

  async getAppTokens<T = DefaultDataProps>(...appGroupDefinitions: AppGroupsDefinition[]) {
    return this.getPositions<AppToken<T>>(appGroupDefinitions, ContractType.APP_TOKEN);
  }
}
