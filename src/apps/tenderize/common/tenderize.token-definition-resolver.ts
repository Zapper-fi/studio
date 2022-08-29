import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
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
    }
  }
`;

@Injectable()
export class TenderizeTokenDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:tenderize:${network}:token-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const data = await this.appToolkit.helpers.theGraphHelper.request<TenderTokenFetcherResponse>({
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
        address: token.tenderToken.toLowerCase(),
        steak: token.steak.toLowerCase(),
        lpToken: token.lpToken.toLowerCase(),
        tenderSwap: token.tenderSwap.toLowerCase(),
      };
    });
    return tokenDefinitions;
  }

  @Cache({
    key: `studio:tenderize:token-apy-data`,
    ttl: 5 * 60, // 60 minutes
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
}
