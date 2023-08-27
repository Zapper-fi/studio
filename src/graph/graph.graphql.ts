import { GraphQLClient, Variables } from 'graphql-request';

import { IGraphWrapper } from './graph.interface';

type GraphCallHook = {
  beforeCallHook?: (query: string, variables?: Variables) => void;
};

export class GraphQLRequest implements IGraphWrapper {
  private client: GraphQLClient;
  private isHostedServiceSubgraph: boolean;
  private beforeCallHook?: (query: string, variables?: Variables) => void;

  constructor(url: string, headers: Record<string, string>, { beforeCallHook }: GraphCallHook = {}) {
    this.client = new GraphQLClient(url, { headers });
    this.isHostedServiceSubgraph = url.includes('api.thegraph.com/subgraphs');
    this.beforeCallHook = beforeCallHook;
  }

  private performFetch(query: string, variables?: Variables): void {
    if (this.beforeCallHook) this.beforeCallHook(query, variables);
  }

  async gqlFetch<T>({ query, variables }: { query: string; variables?: Variables }): Promise<T> {
    this.performFetch(query, variables);

    return this.client.request<T>(query, variables);
  }

  async gqlFetchAll<T>({
    query,
    variables = {},
    dataToSearch,
    first = 1000,
    lastId = '',
    prevResults,
  }: {
    query: string;
    variables?: Variables;
    dataToSearch: string;
    lastId?: string;
    first?: number;
    prevResults?: T;
  }): Promise<T> {
    const results = await this.gqlFetch<T>({
      query,
      variables: {
        ...variables,
        first: first,
        lastId,
      },
    });

    if (results[dataToSearch].length === first) {
      let newPrevResults = results;
      if (prevResults) {
        newPrevResults = {
          ...prevResults,
          ...results,
          [dataToSearch]: [...prevResults[dataToSearch], ...results[dataToSearch]],
        };
      }

      return this.gqlFetchAll({
        query,
        variables,
        dataToSearch,
        first: first,
        lastId: results[dataToSearch][results[dataToSearch].length - 1].id,
        prevResults: newPrevResults,
      });
    }

    if (prevResults) {
      return {
        ...prevResults,
        ...results,
        [dataToSearch]: [...prevResults[dataToSearch], ...results[dataToSearch]],
      };
    } else {
      return results;
    }
  }
}
