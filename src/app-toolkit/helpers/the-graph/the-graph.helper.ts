import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { Variables } from 'graphql-request/dist/types';

type RequestParams = {
  endpoint: string;
  query: string;
  variables?: Variables;
  headers?: Record<string, string>;
};

@Injectable()
export class TheGraphHelper {
  async request<T>({ endpoint, query, variables, headers }: RequestParams) {
    const client = new GraphQLClient(endpoint, { headers });
    return client.request<T>(query, variables);
  }
}
