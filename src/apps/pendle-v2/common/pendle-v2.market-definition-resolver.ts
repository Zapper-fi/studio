import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type AppTokenResponse = {
  address: string;
  proName: string;
  simpleName?: string;
  price: {
    usd: number;
  };
};
export type PendleV2Market = {
  address: string;
  aggregatedApy: number;
  ytFloatingApy: number;
  pt: AppTokenResponse;
  sy: AppTokenResponse;
  yt: AppTokenResponse;
  lp: {
    price: {
      usd: number;
    };
  };
  proName: string;
  expiry: string;
  name: string;
  impliedApy: number;
  underlyingApy: number;
  ptDiscount: number;
};

export type PendleV2MarketsData = {
  results: PendleV2Market[];
};

@Injectable()
export class PendleV2MarketDefinitionsResolver {
  @Cache({
    key: network => `studio:pendle-v2:${network}:market`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getMarketDefinitionsData(network: Network) {
    const url = `https://api-v2.pendle.finance/core/v1/${NETWORK_IDS[network]}/markets?limit=50`;
    const { data } = await Axios.get<PendleV2MarketsData>(url);

    return data.results;
  }

  async getMarketDefinitions(network: Network) {
    const definitionsData = await this.getMarketDefinitionsData(network);

    const marketDefinitions = definitionsData.map(market => {
      return {
        address: market.address,
        name: market.proName,
        price: market.lp.price.usd,
        expiry: market.expiry,
        pt: market.pt,
        sy: market.sy,
        yt: market.yt,
        aggregatedApy: market.aggregatedApy,
        ytFloatingApy: market.ytFloatingApy,
        impliedApy: market.impliedApy,
        underlyingApy: market.underlyingApy,
        ptDiscount: market.ptDiscount,
      };
    });

    return marketDefinitions;
  }
}
