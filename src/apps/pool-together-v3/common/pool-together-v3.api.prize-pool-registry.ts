import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { duration } from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type V3PrizePool = {
  prizePoolAddress: string;
  prizeStrategyAddress: string;
  ticketAddress: string;
  sponsorshipAddress: string;
  underlyingTokenAddress: string;
  tokenFaucets: {
    tokenFaucetAddress: string;
    assetAddress: string;
    measureAddress: string;
  }[];
};

type V3ApiPrizePool = {
  metadata: {
    address: string;
    tokenFaucets: string[];
  };
  prizePool: string;
  token: string;
  ticket: string;
  sponsorship: string;
  prizeStrategy: string;
  tokenFaucets: {
    tokenFaucet: string;
    measure: string;
    asset: string;
  }[];
};

@Injectable()
export class PoolTogetherV3ApiPrizePoolRegistry {
  @Cache({
    key: (network: Network) => `pool-together-v3:${network}:prize-pool-registry`,
    ttl: duration(30, 'minutes').asSeconds(),
  })
  async getV3PrizePools(network: Network): Promise<V3PrizePool[]> {
    const prizePoolUrl = `https://pooltogether-api.com/v3/addresses/prize-pools/${NETWORK_IDS[network]}`;
    const v3PrizePools = await Axios.get<V3ApiPrizePool[]>(prizePoolUrl).then(v => v.data);

    return Object.values(v3PrizePools).map(
      ({ prizePool, prizeStrategy, ticket, token, sponsorship, tokenFaucets }) => ({
        prizePoolAddress: prizePool.toLowerCase(),
        prizeStrategyAddress: prizeStrategy.toLowerCase(),
        ticketAddress: ticket.toLowerCase(),
        sponsorshipAddress: sponsorship.toLowerCase(),
        underlyingTokenAddress: token.toLowerCase(),
        tokenFaucets: tokenFaucets.map(({ tokenFaucet, measure, asset }) => ({
          tokenFaucetAddress: tokenFaucet.toLowerCase(),
          assetAddress: asset.toLowerCase(),
          measureAddress: measure.toLowerCase(),
        })),
      }),
    );
  }
}
