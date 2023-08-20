import { Injectable } from '@nestjs/common';

import { GraphQLRequest } from './graph.graphql';

@Injectable()
export class GraphService {
  getClient(url: string, headers: Record<string, string>) {
    return new GraphQLRequest(url, headers);
  }
}
