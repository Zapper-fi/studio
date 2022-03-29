import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';
import qs from 'qs';

import { ContractType } from '~position/contract.interface';
import { AbstractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';

import { PositionSource } from './position-source.interface';

@Injectable()
export class ApiPositionSource implements PositionSource {
  private readonly axios: AxiosInstance;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  async getPositions<T extends AbstractPosition<any>>(
    definitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]> {
    const pathParam = contractType === ContractType.APP_TOKEN ? 'tokens' : 'contract-positions';
    const query = qs.stringify({ definitions });
    const { data: positions } = await this.axios.get<T[]>(`/v1/positions/${pathParam}?${query}`);

    return positions;
  }
}
