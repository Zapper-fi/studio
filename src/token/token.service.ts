import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';

import { Cache } from '~cache/cache.decorator';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

@Injectable()
export class TokenService {
  private readonly axios: AxiosInstance;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  @Cache({ key: (network: Network) => `token-prices:${network}`, ttl: 60 })
  async getTokenPrices(network: Network) {
    const { data: tokenPrices } = await this.axios.get<BaseToken[]>('/v1/prices-v3', { params: { network } });
    return tokenPrices;
  }

  async getTokenPrice({ network, address }: { network: Network; address: string }) {
    const tokenPrices = await this.getTokenPrices(network);
    const match = tokenPrices.find(tp => tp.address.toLowerCase() === address.toLowerCase());

    return match ?? null;
  }
}
