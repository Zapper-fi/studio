import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type TokenApyResponse = Record<
  string,
  {
    subgraphId: string;
    apy: string;
  }
>;

export type TenderTokenFetcherResponse = {
  configs: {
    id: string;
    lpToken: string;
    tenderToken: string;
    symbol: string;
    steak: string;
    tenderSwap: string;
    tenderFarm: string;
  }[];
};

export type RewardRateFetcherResponse = {
  rewardsAddedEvents: {
    amount: string;
    timestamp: string;
  }[];
};

export const TOKEN_QUERY = gql`
  {
    configs {
      id
      lpToken
      tenderToken
      symbol
      steak
      tenderSwap
      tenderFarm
    }
  }
`;

@Injectable()
export class TenderizeTokenDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:tenderize:${network}:token-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const data = await gqlFetch<TenderTokenFetcherResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/tenderize/tenderize-${network}`,
      query: TOKEN_QUERY,
    });

    return data;
  }

  async getTokenDefinitions(network: Network) {
    const definitionsData = await this.getVaultDefinitionsData(network);

    const tokenDefinitions = definitionsData.configs.map(token => {
      return {
        id: token.id.toLowerCase(),
        steak: token.steak.toLowerCase(),
        lpToken: token.lpToken.toLowerCase(),
        tenderToken: token.tenderToken.toLowerCase(),
        tenderSwap: token.tenderSwap.toLowerCase(),
        tenderFarm: token.tenderFarm.toLowerCase(),
      };
    });
    return tokenDefinitions;
  }

  @Cache({
    key: `studio:tenderize:token-apy-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getTokenApyData() {
    const { data } = await Axios.get<TokenApyResponse>('https://www.tenderize.me/api/apy');

    return data;
  }

  async getTokenApy(id: string) {
    const apyDataRaw = await this.getTokenApyData();
    const apyData = Object.values(apyDataRaw);
    const apyRaw = apyData.find(x => x.subgraphId.toLowerCase() === id)?.apy ?? 0;

    return Number(apyRaw);
  }

  @Cache({
    key: (network, tenderFarm) => `studio:tenderize:${network}:${tenderFarm}-reward-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getRewardRateData(network: Network, tenderFarm: string) {
    return gqlFetch<RewardRateFetcherResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/tenderize/tenderize-${network}`,
      variables: { tenderFarm },
      query: gql`
        query ($tenderFarm: String!) {
          rewardsAddedEvents(where: { tenderFarm: $tenderFarm }, first: 2, orderBy: timestamp, orderDirection: desc) {
            amount
            timestamp
          }
        }
      `,
    });
  }

  async getRewardRate(network: Network, tenderFarm: string) {
    const { rewardsAddedEvents } = await this.getRewardRateData(network, tenderFarm.toLowerCase());
    if (rewardsAddedEvents.length != 2) return 0;

    const [{ amount, timestamp }, { timestamp: prevTimestamp }] = rewardsAddedEvents;
    return BigInt(amount) / (BigInt(timestamp) - BigInt(prevTimestamp));
  }
}
