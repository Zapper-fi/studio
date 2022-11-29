export interface Strategy {
  id: string;
  createdAtTimestamp: string;
  amount0: string;
  amount1: string;
  shares: string;
  txCount: string;
  name: string;
  owner: string;
  userCount: string;
  type: DataFeed;
  hash: string;
  pool: string;
  unusedAmount0: string;
  unusedAmount1: string;
  feeTier: string;
  token0: Token;
  token1: Token;
  adds: Add[];
  removes: Add[];
  since_inception: { USD: number };
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  onHold: boolean;
  address: string;
  dataFeed: DataFeed;
  subTitle: null | string;
  title: string;
  aum: number;
  apy: number;
}

interface Add {
  id: string;
  timestamp: string;
  amount0: string;
  amount1: string;
  __typename: AddTypename;
}

enum AddTypename {
  Add = 'Add',
  Remove = 'Remove',
}

enum DataFeed {
  Chainlink = 'Chainlink',
  Twap = 'Twap',
}

export interface User {
  id: string;
  positions: Position[];
}

interface Position {
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  strategy: Strategy;
  amount0: string;
  amount1: string;
}

export interface PositionStrategy {
  id: string;
  name: string;
  pool: string;
  hash: string;
  type: string;
  token0: Token;
  token1: Token;
}
interface Token {
  id: string;
  totalSupply: string;
  name: string;
  symbol: string;
  decimals: string;
}
