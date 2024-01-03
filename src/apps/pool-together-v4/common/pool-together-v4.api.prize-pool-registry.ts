import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { duration } from 'moment';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type V4PrizePool = {
  prizePoolAddress: string;
  prizeStrategyAddress: string;
  ticketAddress: string;
  underlyingTokenAddress: string;
};

type V4ApiPrizePool = {
  metadata: {
    address: string;
    type: string;
    version: string;
  };
  prizePool: string;
  token: string;
  ticket: string;
  prizeStrategy: string;
  yieldSource: string;
};

@Injectable()
export class PoolTogetherV4ApiPrizePoolRegistry {
  @Cache({
    key: (network: Network) => `pool-together-v4:${network}:prize-pool-registry`,
    ttl: duration(30, 'minutes').asSeconds(),
  })
  async getV4PrizePools(network: Network): Promise<V4PrizePool[]> {
    const prizePoolUrl = `https://pooltogether-api.com/v4/addresses/prize-pools/${NETWORK_IDS[network]}`;
    const v4PrizePools = await Axios.get<{ [prizePoolAddress: string]: V4ApiPrizePool }>(prizePoolUrl).then(
      v => v.data,
    );

    return Object.values(v4PrizePools).map(({ ticket, token, prizePool, prizeStrategy }) => ({
      prizePoolAddress: prizePool.toLowerCase(),
      prizeStrategyAddress: prizeStrategy.toLowerCase(),
      ticketAddress: ticket.toLowerCase(),
      underlyingTokenAddress: token.toLowerCase(),
    }));
  }
}
