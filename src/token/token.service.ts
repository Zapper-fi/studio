import { Inject, Injectable } from '@nestjs/common';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { TokenApiClient } from './token-api.client';

@Injectable()
export class TokenService {
  constructor(@Inject(TokenApiClient) private readonly tokenApiClient: TokenApiClient) {}

  async onApplicationBootstrap() {
    await this.getTokenPrices(Network.ETHEREUM_MAINNET);
  }

  @Cache({ key: (network: Network) => `token-prices:${network}`, ttl: 60 })
  async getTokenPrices(network: Network) {
    return this.tokenApiClient.getAllBaseTokenPrices(network);
  }

  async getTokenPrice({ network, address }: { network: Network; address: string }) {
    const tokenPrices = await this.getTokenPrices(network);
    const match = tokenPrices.find(tp => tp.address.toLowerCase() === address.toLowerCase());

    return match ?? null;
  }
}
