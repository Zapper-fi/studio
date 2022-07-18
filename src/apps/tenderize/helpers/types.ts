export type APYResponse = Record<
  string,
  {
    name: string;
    subgraphId: string;
    apy: string;
    tvl: number;
  }
>;
