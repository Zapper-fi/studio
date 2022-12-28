import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

export type UnipilotVaultDefinition = {
  address: string;
  token0Address: string;
  token1Address: string;
  feeTier: string;
  token0Symbol: string;
  token1Symbol: string;
  strategyId?: string;
  totalLockedToken0: string;
  totalLockedToken1: string;
};

type TokensResponse = {
  tokens: {
    id: string;
  }[];
};

const ALL_TOKENS_QUERY = gql`
  {
    tokens(first: 500) {
      id
    }
  }
`;

@Injectable()
export class SushiswapBentoboxVaultTokensResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: _network => `studio:${SUSHISWAP_BENTOBOX_DEFINITION.id}:${_network}:vault-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultTokensData(subgraphUrl: string, _network: Network) {
    const data = await this.appToolkit.helpers.theGraphHelper.request<TokensResponse>({
      endpoint: subgraphUrl,
      query: ALL_TOKENS_QUERY,
    });

    return data.tokens;
  }

  async getVaultTokens(subgraphUrl: string, network: Network) {
    const vaultTokenData = await this.getVaultTokensData(subgraphUrl, network);

    const vaultTokens = vaultTokenData.map(token => {
      return token.id;
    });

    return vaultTokens;
  }
}
