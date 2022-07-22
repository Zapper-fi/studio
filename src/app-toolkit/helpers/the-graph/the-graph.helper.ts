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

interface gqlFetchAllParams<T> {
  query: string;
  endpoint: string;
  variables?: Variables;
  dataToSearch: string;
  offset?: number;
  first?: number;
  prevResults?: T;
}

interface gqlFetchAllStableParams<T> {
  query: string;
  endpoint: string;
  variables?: Variables;
  dataToSearch: string;
  lastId?: string;
  first?: number;
  prevResults?: T;
}

@Injectable()
export class TheGraphHelper {
  async request<T = any>({ endpoint, query, variables, headers }: RequestParams) {
    const client = new GraphQLClient(endpoint, { headers });
    return client.request<T>(query, variables);
  }

  async requestGraph<T = any>({ endpoint, query, variables = {} }: RequestGraphParams) {
    const presentQuery = typeof query === 'string' ? query : query.present;
    const pastQuery = typeof query === 'string' ? null : query.past;
    const finalQuery = typeof variables.blockTag === 'number' && pastQuery ? pastQuery : presentQuery;

    return this.request<T>({ endpoint, query: finalQuery, variables });
  }

  async gqlFetchAll<T = any>({
    query,
    endpoint,
    variables = {},
    dataToSearch,
    offset = 0,
    first = 1000,
    prevResults,
  }: gqlFetchAllParams<T>): Promise<T> {
    const results = await this.requestGraph<T>({
      endpoint,
      query,
      variables: {
        ...variables,
        first: first,
        skip: offset,
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
        endpoint,
        variables,
        dataToSearch,
        first: first,
        offset: offset + first,
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

  async gqlFetchAllStable<T = any>({
    query,
    endpoint,
    variables = {},
    dataToSearch,
    first = 1000,
    lastId = '',
    prevResults,
  }: gqlFetchAllStableParams<T>): Promise<T> {
    const results = await this.requestGraph<T>({
      endpoint,
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

      return this.gqlFetchAllStable({
        query,
        endpoint,
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
