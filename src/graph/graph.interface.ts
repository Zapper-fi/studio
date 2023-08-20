import { Variables } from 'graphql-request';

export type GraphQLParams = {
  query: string;
  variables?: Variables;
};

export type GraphQLFetchAllParams<T> = GraphQLParams & {
  dataToSearch: string;
  lastId?: string;
  first?: number;
  prevResults?: T;
};

export interface IGraphWrapper {
  gqlFetch<T>(graphQLParams: GraphQLParams): Promise<T>;
  gqlFetchAll<T>(graphQLFetchAllParams: GraphQLFetchAllParams<T>): Promise<T>;
}
