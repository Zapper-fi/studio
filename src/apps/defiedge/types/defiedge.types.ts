export interface Strategy {
  id: string;
  pool: string;
  token0: Token;
  token1: Token;
  subTitle: string | null;
  title: string;
}

export interface Token {
  id: string;
  totalSupply: string;
  name: string;
  symbol: string;
  decimals: string;
}
