import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

export type EulerTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: {
      id: string;
      interestRate: string;
      borrowAPY: string;
      supplyAPY: string;
      totalSupply: string;
      twap: string;
      name: string;
      symbol: string;
      decimals: string;
      dTokenAddress: string;
      eTokenAddress: string;
      pTokenAddress: string;
    }[];
  };
}

export const MARKET_QUERY = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets(first: 1000) {
        id
        interestRate
        borrowAPY
        supplyAPY
        totalSupply
        twap
        name
        symbol
        decimals
        dTokenAddress
        eTokenAddress
        pTokenAddress
      }
    }
  }
`;

export enum EulerTokenType {
  D_TOKEN = 'dTokenAddress',
  E_TOKEN = 'eTokenAddress',
  P_TOKEN = 'pTokenAddress',
}

const brokenMarketAddress = ['0x31c8eacbffdd875c74b94b077895bd78cf1e64a3']; // RAD

@Injectable()
export class EulerTokenDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  private async getTokenDefinitionsData() {
    const data = await gqlFetch<EulerMarketsResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet`,
      query: MARKET_QUERY,
    });

    const marketRaw = data.eulerMarketStore.markets;

    return marketRaw.filter(x => !brokenMarketAddress.includes(x.id));
  }

  async getTokenDefinitions(tokenType: EulerTokenType) {
    const definitionsData = await this.getTokenDefinitionsData();

    const tokenDefinitions = definitionsData.map(market => {
      if (market[tokenType] === ZERO_ADDRESS) return null;
      return {
        address: market[tokenType].toLowerCase(),
        underlyingTokenAddress: market.id.toLowerCase(),
      };
    });

    return _.compact(tokenDefinitions);
  }

  async getMarket(tokenAddress: string, tokenType: EulerTokenType) {
    const definitionsData = await this.getTokenDefinitionsData();

    return definitionsData.find(x => x[tokenType].toLowerCase() === tokenAddress);
  }

  async getMarketByUnderlying(tokenAddress: string) {
    const definitionsData = await this.getTokenDefinitionsData();

    return definitionsData.find(x => x.id.toLowerCase() === tokenAddress);
  }
}
