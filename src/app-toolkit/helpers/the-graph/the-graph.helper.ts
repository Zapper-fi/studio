import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { Variables } from 'graphql-request/dist/types';

type RequestParams = {
  endpoint: string;
  query: string;
  variables?: Variables;
  headers?: Record<string, string>;
};

type RequestGraphParams = {
  endpoint: string;
  query: string | { present: string; past: string };
  variables?: Variables;
  headers?: Record<string, string>;
};

@Injectable()
export class TheGraphHelper {
  async request<T = any>({ endpoint, query, variables, headers }: RequestParams) {
    const client = new GraphQLClient(endpoint, { headers });
    return client.request<T>(query, variables);
  }

  async requestGraph<T>({ endpoint, query, variables = {} }: RequestGraphParams) {
    const presentQuery = typeof query === 'string' ? query : query.present;
    const pastQuery = typeof query === 'string' ? null : query.past;
    const finalQuery = typeof variables.blockTag === 'number' && pastQuery ? pastQuery : presentQuery;

    return this.request<T>({ endpoint, query: finalQuery, variables });
  }
}
