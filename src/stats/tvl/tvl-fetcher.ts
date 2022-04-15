import { GraphQLClient } from 'graphql-request';
import { sumBy } from 'lodash';

type Position = { supply: number; price: number };

export abstract class TvlFetcher {
  constructor() {}

  abstract getTvl(): Promise<number>;

  sumPositions(...positions: (Position[] | number)[]) {
    let total = 0;
    for (const position of positions) {
      if (typeof position === 'number') {
        total = total + position;
      } else {
        total = total + sumBy(position, p => p.supply * p.price);
      }
    }

    return total;
  }

  async queryTheGraph<T>({ subgraphUrl, query }: { subgraphUrl: string; query: string }) {
    const client = new GraphQLClient(`https://api.thegraph.com/subgraphs/name${subgraphUrl}`);
    const response = await client.request<T>(query);
    return response;
  }
}
