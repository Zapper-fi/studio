import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Network, NETWORK_IDS } from '~types/network.interface';

export type V4PrizePool = {
  prizePoolAddress: string;
  prizeStrategyAddress: string;
  ticketAddress: string;
  underlyingTokenAddress: string;
};

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
export class PoolTogetherApiPrizePoolRegistry {
  ///////////////////// V4 Prize Pools /////////////////////
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
