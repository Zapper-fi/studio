import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';

type QueryResponse = {
  balancers: { totalLiquidity: string }[];
};
const QUERY = gql`
  {
    balancers(first: 1) {
      totalLiquidity
    }
  }
`;
const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx';

@Register.TvlFetcher({ appId: BEETHOVEN_X_DEFINITION.id, network: Network.FANTOM_OPERA_MAINNET })
export class FantomBeethovenXTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const response = await graphHelper.request<QueryResponse>({
      endpoint: subgraphUrl,
      query: QUERY,
      variables: {},
      headers: { 'Content-Type': 'application/json' },
    });

    const tvl = Number(response.balancers[0]?.totalLiquidity ?? 0);

    return tvl;
  }
}
