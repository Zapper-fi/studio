import { gql } from 'graphql-request';

import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';
import { GET_PAIRS } from '../graphql/getPairs';
import { GET_USER_POSITIONS } from '../graphql/getUserPositions';

interface gqlFetchAllParams<T> {
  graphHelper: TheGraphHelper;
  query: string;
  endpoint: string;
  variables: any;
  dataToSearch: string;
  offset?: number;
  first?: number;
  prevResults?: T;
}
export const gqlFetchAll = async <T>({
  graphHelper,
  query,
  endpoint,
  variables,
  dataToSearch,
  offset,
  first,
  prevResults,
}: gqlFetchAllParams<T>): Promise<T> => {
  const firstToUse = first || 1000;
  const offsetToUse = offset || 0;

  const results = await graphHelper.requestGraph<T>({
    endpoint,
    query,
    variables: {
      ...variables,
      first: firstToUse,
      skip: offsetToUse,
    },
  });

  if (results[dataToSearch].length === firstToUse + offsetToUse) {
    return gqlFetchAll({
      graphHelper,
      query,
      endpoint,
      variables,
      dataToSearch,
      first: offsetToUse + firstToUse,
      offset: firstToUse,
      prevResults,
    });
  }

  if (prevResults) {
    return {
      ...prevResults,
      ...results,
      [dataToSearch]: {
        ...prevResults[dataToSearch],
        ...results[dataToSearch],
      }
    };
  } else {
    return results;
  }
}

type MeanFinancePosition = {
  positions: {
    id: string;
    executedSwaps: string;
    user: string;
    from: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    to: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    status: string;
    swapInterval: {
      id: string;
      interval: string;
    };
    current: {
      id: string;
      rate: string;
      remainingSwaps: string;
      remainingLiquidity: string;
      idleSwapped: string;
    };
  }[];
};

export const getUserPositions = (address: string, network: string, graphHelper: TheGraphHelper) => {
  return gqlFetchAll<MeanFinancePosition>({
    graphHelper,
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: GET_USER_POSITIONS,
    variables: { address },
    dataToSearch: 'positions',
  });
};

type MeanFinancePair = {
  pairs: {
    id: string;
    tokenA: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    tokenB: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
  }[];
};

export const getPairs = (network: string, graphHelper: TheGraphHelper) => {
  return gqlFetchAll<MeanFinancePair>({
    graphHelper,
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: GET_PAIRS,
    variables: {},
    dataToSearch: 'pairs',
  });
};
