import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

export const getTokensQuery = gql`
  query getTokens {
    tokens(first: 1000) {
      id
      contract {
        id
      }
    }
  }
`;

export type LlamapayTokensResponse = {
  tokens: {
    id: string;
    contract: {
      id: string;
    };
  }[];
};

export const getStreamsQuery = gql`
  query StreamAndHistory($id: ID!) {
    user(id: $id) {
      streams(orderBy: createdTimestamp, orderDirection: desc, where: { active: true }) {
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
      streamId: number;
      contract: {
        address: string;
      };
      payer: {
        id: string;
      };
      payee: {
        id: string;
      };
      token: {
        address: string;
        name: string;
        decimals: number;
        symbol: string;
      };
      amountPerSec: string;
    }[];
  };
  recipientStreams: {
    id: string;
  }[];
};

export const getVestingEscrowsQuery = gql`
  query VestingEscrows($id: ID!) {
    vestingEscrows(where: { recipient: $id }) {
      id
      admin
      recipient
      token {
        id
        symbol
        name
        decimals
      }
    }
  }
`;

export type LlamapayVestingEscrowsResponse = {
  vestingEscrows: {
    id: string;
    admin: string;
    recipient: string;
    token: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
  }[];
};

@Injectable()
export class LlamapayStreamApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens(network: string) {
    const tokensResponse = await gqlFetch<LlamapayTokensResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-${network}?source=zapper`,
      query: getTokensQuery,
    });

    return tokensResponse.tokens.map(token => ({
      address: token.contract.id.toLowerCase(),
      tokenAddress: token.id.toLowerCase(),
    }));
  }

  async getStreams(address: string, network: string) {
    const streamsResponse = await gqlFetch<LlamapayStreamsResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-${network}?source=zapper`,
      query: getStreamsQuery,
      variables: { id: address },
    });

    return streamsResponse.user?.streams ?? [];
  }

  async getVestingEscrows(address: string, network: string) {
    const vestingEscrowsResponse = await gqlFetch<LlamapayVestingEscrowsResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-vesting-${network}?source=zapper`,
      query: getVestingEscrowsQuery,
      variables: { id: address },
    });

    return vestingEscrowsResponse.vestingEscrows ?? [];
  }
}
