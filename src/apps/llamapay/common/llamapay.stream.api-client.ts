import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

export type LlamapayTokensResponse = {
  tokens: {
    id: string;
  }[];
};

export const getStreamsQuery = gql`
  query StreamAndHistory($id: ID!, $network: String!) {
    user(id: $id) {
      streams(orderBy: createdTimestamp, orderDirection: desc, where: {active: true}) {
        streamId
        contract {
          address
        }
        payer {
          id
        }
        payee {
          id
        }
        token {
          address
          name
          decimals
          symbol
        }
        amountPerSec
      }
    }
  }
`;

export type LlamapayStreamsResponse = {
  user: {
    streams: {
      streamId: integer,
      contract: {
        address: string,
      },
      payer: {
        id: string,
      },
      payee: {
        id: string,
      },
      token: {
        address: string,
        name: string,
        decimals: integer,
        symbol: string,
      },
      amountPerSec: string,
    }[];
  };
  recipientStreams: {
    id: string;
  }[];
};

@Injectable()
export class LlamapayStreamApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getStreams(address: string, _network: Network) {
    const streamsResponse = await this.appToolkit.helpers.theGraphHelper.request<LlamapayStreamsResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet',
      query: getStreamsQuery,
      variables: { id: address, network: _network },
    });

    return [...streamsResponse.user.streams];
  }

}
