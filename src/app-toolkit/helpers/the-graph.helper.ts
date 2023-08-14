import { GraphQLClient, Variables } from 'graphql-request';

export const gqlFetch = async <T = any>({
  endpoint,
  query,
  variables = {},
  headers = {},
}: {
  endpoint: string;
  query: string;
  variables?: Variables;
  headers?: Record<string, string>;
}): Promise<T> => {
  const client = new GraphQLClient(endpoint, { headers });
  return client.request<T>(query, variables);
};

export const gqlFetchAll = async <T = any>({
  query,
  endpoint,
  variables = {},
  dataToSearch,
  first = 1000,
  lastId = '',
  prevResults,
}: {
  query: string;
  endpoint: string;
  variables?: Variables;
  dataToSearch: string;
  lastId?: string;
  first?: number;
  prevResults?: T;
}): Promise<T> => {
  const results = await gqlFetch<T>({
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

    return gqlFetchAll({
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
};
