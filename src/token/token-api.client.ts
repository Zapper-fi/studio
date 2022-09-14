import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';

import { Network } from '~types/network.interface';

import { BaseTokenPrice } from './selectors/token-price-selector.interface';

@Injectable()
export class TokenApiClient {
  private readonly axios: AxiosInstance;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  async getAllBaseTokenPrices(network: Network) {
    const { data: tokenPrices } = await this.axios.get<BaseTokenPrice[]>('/v2/prices', { params: { network } });
    return tokenPrices;
  }
}
