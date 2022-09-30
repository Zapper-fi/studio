import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';
import { Network } from '~types';

import { GET_POSITIONS } from '../graphql/getPositions';
import { GET_USER_POSITIONS } from '../graphql/getUserPositions';
import { MEAN_GRAPHQL_URL, PositionVersions } from './addresses';

type MeanFinancePosition = {
  positions: {
    id: string;
    totalExecutedSwaps: string;
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
    rate: string;
    remainingSwaps: string;
    remainingLiquidity: string;
    toWithdraw: string;
  }[];
};

export const getUserPositions = (address: string, network: Network, graphHelper: TheGraphHelper, version: PositionVersions) => {
  const endpoint = MEAN_GRAPHQL_URL[version][network];
  if (!endpoint) {
    return Promise.resolve({ positions: [] })
  }
  return graphHelper.gqlFetchAll<MeanFinancePosition>({
    endpoint,
    query: GET_USER_POSITIONS,
    variables: { address },
    dataToSearch: 'positions',
  });
};

export const getPositions = (network: string, graphHelper: TheGraphHelper, version: PositionVersions) => {
  const endpoint = MEAN_GRAPHQL_URL[version][network];
  if (!endpoint) {
    return Promise.resolve({ positions: [] })
  }
  return graphHelper.gqlFetchAll<MeanFinancePosition>({
    endpoint,
    query: GET_POSITIONS,
    variables: {},
    dataToSearch: 'positions',
  });
};
