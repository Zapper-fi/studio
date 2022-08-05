import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

export const getTokensQuery = gql`
  query getTokens {
    tokens(first: 1000) {
      id
    }
  }
`;

export type SablierTokensResponse = {
  tokens: {
    id: string;
  }[];
};

export const getStreamsQuery = gql`
  query getLegacyStreams($address: String!) {
    senderStreams: streams(where: { sender: $address }) {
      id
    }
    recipientStreams: streams(where: { recipient: $address }) {
      id
    }
  }
`;

export type SablierStreamsResponse = {
  senderStreams: {
    id: string;
  }[];
  recipientStreams: {
    id: string;
  }[];
};

export const getStreamsToSalariesQuery = gql`
  query getStreamsToSalaries($streamIds: [String]!) {
    streamToSalaries(where: { salaryId_in: $streamIds }) {
      id
      salaryId
    }
  }
`;

export type SablierStreamToSalariesResponse = {
  streamToSalaries: {
    id: string;
    salaryId: string;
  }[];
};

@Injectable()
export class SablierStreamApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens() {
    const tokensResponse = await this.appToolkit.helpers.theGraphHelper.request<SablierTokensResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/sablierhq/sablier',
      query: getTokensQuery,
    });

    return tokensResponse.tokens.map(({ id }) => id.toLowerCase());
  }

  async getStreams(address: string, _network: Network) {
    const streamsResponse = await this.appToolkit.helpers.theGraphHelper.request<SablierStreamsResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/sablierhq/sablier',
      query: getStreamsQuery,
      variables: { address: address },
    });

    const allStreams = [...streamsResponse.senderStreams, ...streamsResponse.recipientStreams];
    const legacyStreamIds = _.uniq(allStreams.map(v => v.id).filter(v => Number(v) >= 100_000));

    return legacyStreamIds.map(id => ({ streamId: id, salaryId: null }));
  }

  async getLegacyStreams(address: string, _network: Network) {
    const streamsResponse = await this.appToolkit.helpers.theGraphHelper.request<SablierStreamsResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/sablierhq/sablier',
      query: getStreamsQuery,
      variables: { address: address },
    });

    const allStreams = [...streamsResponse.senderStreams, ...streamsResponse.recipientStreams];
    const legacyStreamIds = _.uniq(allStreams.map(v => v.id).filter(v => Number(v) < 100_000));

    const salariesResponse = await this.appToolkit.helpers.theGraphHelper.request<SablierStreamToSalariesResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/sablierhq/sablier',
      query: getStreamsToSalariesQuery,
      variables: { streamIds: legacyStreamIds },
    });

    return salariesResponse.streamToSalaries.map(({ id, salaryId }) => ({ streamId: id, salaryId }));
  }
}
