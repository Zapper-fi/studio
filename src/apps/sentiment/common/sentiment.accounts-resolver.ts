import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';

type GetAccountsResponse = {
  accounts: {
    id: string;
    blockNumber: string;
    owner: {
      id: string;
    };
  }[];
};

const GET_ALL_ACCOUNTS_QUERY = gql`
  query getFirstAccounts($first: Int!, $lastId: String) {
    accounts(first: $first, orderBy: id, orderDirection: asc, where: { id_gt: $lastId }) {
      id
      blockNumber
      owner {
        id
      }
    }
  }
`;

@Injectable()
export class SentimentAccountsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:sentiment:${network}:accounts`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getAllAccountsData() {
    const data = await gqlFetchAll<GetAccountsResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/r0ohafza/sentiment`,
      query: GET_ALL_ACCOUNTS_QUERY,
      variables: undefined,
      dataToSearch: 'accounts',
    });

    return data.accounts;
  }

  async getAccountsOfOwner(address: string) {
    const accountsData = await this.getAllAccountsData();

    const accountOfOwner = accountsData.filter(x => x.owner.id == address).map(x => x.id);

    return accountOfOwner;
  }
}
