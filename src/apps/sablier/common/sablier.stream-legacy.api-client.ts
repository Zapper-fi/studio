import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { getStreamsQuery, SablierStreamsResponse } from './sablier.stream.api-client';

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
export class SablierStreamLegacyApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

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
