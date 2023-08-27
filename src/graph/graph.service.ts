import { GraphQLRequest } from './graph.graphql';

export class GraphService {
  getClient(url: string, headers: Record<string, string>) {
    return new GraphQLRequest(url, headers);
  }
}
