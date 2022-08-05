import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

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

@Injectable()
export class SablierStreamApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

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
}
