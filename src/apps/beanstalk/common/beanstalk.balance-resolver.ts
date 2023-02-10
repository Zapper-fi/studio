import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

export interface BeanstalkApiSiloData {
  farmer: {
    deposits: {
      token: string;
      amount: string;
    }[];
    withdraws: {
      token: string;
      amount: string;
    }[];
  };
}

export const GET_DEPOSIT = gql`
  query getSiloBalance($token: String, $account: ID!) {
    farmer(id: $account) {
      deposits(where: { token: $token, amount_gt: 0 }) {
        amount
      }
      withdraws(where: { token: $token, claimed: false }) {
        amount
      }
    }
  }
`;

@Injectable()
export class BeanstalkBalanceResolver {
  private async getSiloBalancesData(address: string, tokenAddress: string) {
    const endpoint = `https://graph.node.bean.money/subgraphs/name/beanstalk`;
    const data = await gqlFetch<BeanstalkApiSiloData>({
      endpoint,
      query: GET_DEPOSIT,
      variables: {
        token: tokenAddress,
        account: address,
      },
    });

    return data.farmer;
  }

  async getSiloBalances(address: string, token: string) {
    const siloBalancesData = await this.getSiloBalancesData(address, token);

    const depositBalances = sumBy(siloBalancesData?.deposits, t => Number(t.amount));
    const withdrawnBalances = sumBy(siloBalancesData?.withdraws, t => Number(t.amount));

    return depositBalances + withdrawnBalances;
  }
}
