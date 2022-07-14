import { TheGraphHelper } from '~app-toolkit/helpers/the-graph/the-graph.helper';
import { GET_PAIRS } from '../graphql/getPairs';
import { GET_POSITIONS } from '../graphql/getPositions';
import { GET_USER_POSITIONS } from '../graphql/getUserPositions';

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
  return graphHelper.gqlFetchAll<MeanFinancePosition>({
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: GET_USER_POSITIONS,
    variables: { address },
    dataToSearch: 'positions',
  });
};

export const getPositions = (network: string, graphHelper: TheGraphHelper) => {
  return graphHelper.gqlFetchAll<MeanFinancePosition>({
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: GET_POSITIONS,
    variables: {},
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
  return graphHelper.gqlFetchAll<MeanFinancePair>({
    endpoint: `https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-${network}`,
    query: GET_PAIRS,
    variables: {},
    dataToSearch: 'pairs',
  });
};
