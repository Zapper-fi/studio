import { gql } from 'graphql-request';

import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';

type UserOpenOrders = {
  orders: {
    id: string;
    inputToken: string;
    inputAmount: string;
  }[];
};

export const getOpenOrdersByUser = (creator: string, network: string, graphHelper: TheGraphHelper) => {
  const query = gql`
    query GetOrdersByOwner($creator: String) {
      orders(where: { creator: $creator, status: ACTIVE }) {
        id
        inputToken
        inputAmount
      }
    }
  `;

  return graphHelper.requestGraph<UserOpenOrders>({
    endpoint: `https://api.thegraph.com/subgraphs/name/symphony-finance/yolo-${network}`,
    query: query,
    variables: { creator },
  });
};
