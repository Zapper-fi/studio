import { OptimismKwentaPerpContractPositionFetcher } from './kwenta.perp.contract-position-fetcher';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gql } from 'graphql-request';
import KWENTA_DEFINITION from '../kwenta.definition';

type GetCrossMarginAccounts = {
  crossMarginAccounts: {
    id: string;
  }[];
};

const getCrossMarginAccountsQuery = gql`
  query MyQuery($address: String!) {
      crossMarginAccounts(where: {owner: $address}) {
        id
      }
  }
`;

@PositionTemplate()
export class OptimismKwentaCrossContractPositionFetcher extends OptimismKwentaPerpContractPositionFetcher {

  groupLabel = 'Cross Margin';

  async getAccountAddress(address: string): Promise<string> {
    const crossMarginAccountsFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetCrossMarginAccounts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main',
      query: getCrossMarginAccountsQuery,
      variables: { address: address },
    });
    if (crossMarginAccountsFromSubgraph.crossMarginAccounts.length === 0) {
      return "";
    }
    return crossMarginAccountsFromSubgraph.crossMarginAccounts[0].id;
  }

}
