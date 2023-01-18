import { gql } from 'graphql-request';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

import { OptimismKwentaPerpContractPositionFetcher } from '../common/kwenta.perp.contract-position-fetcher';

type GetCrossMarginAccounts = {
  crossMarginAccounts: {
    id: string;
  }[];
};

const getCrossMarginAccountsQuery = gql`
  query MyQuery($address: String!) {
    crossMarginAccounts(where: { owner: $address }) {
      id
    }
  }
`;

@PositionTemplate()
export class OptimismKwentaCrossContractPositionFetcher extends OptimismKwentaPerpContractPositionFetcher {
  groupLabel = 'Cross Margin';

  async getAccountAddress(address: string): Promise<string> {
    const crossMarginAccountsFromSubgraph = await gqlFetch<GetCrossMarginAccounts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main',
      query: getCrossMarginAccountsQuery,
      variables: { address: address },
    });

    if (crossMarginAccountsFromSubgraph.crossMarginAccounts.length === 0) {
      return ZERO_ADDRESS;
    }

    return crossMarginAccountsFromSubgraph.crossMarginAccounts[0].id;
  }
}
