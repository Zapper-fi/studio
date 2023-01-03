import { Inject } from '@nestjs/common';
import axios from 'axios';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MuxContractFactory } from '~apps/mux';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

export type LiquidityAsset = {
  muxLPPrice: number;
  assets: Asset[];
};

type Asset = {
  symbol: string;
  price: number;
  liquidityOnChains: LiquidityOnChains;
};

type LiquidityOnChains = {
  [chainId: string]: {
    value: number;
  };
};

type TokensResponse = {
  assets?: {
    symbol: string;
    decimal: number;
    tokenAddress: string;
  }[];
};

const ASSETS_TOKENS_QUERY = gql`
  {
    assets {
      symbol
      decimal
      tokenAddress
    }
  }
`;

export abstract class MuxMlpTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  abstract mlpAddress: string;
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) protected readonly contractFactory: MuxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return [this.mlpAddress];
  }

  async getUnderlyingTokenDefinitions(_params: GetUnderlyingTokensParams<Erc20, DefaultAppTokenDefinition>) {
    const response = await this.appToolkit.helpers.theGraphHelper.request<TokensResponse>({
      endpoint: this.subgraphUrl,
      query: ASSETS_TOKENS_QUERY,
    });

    return (response.assets ?? []).map(({ tokenAddress }) => ({ address: tokenAddress, network: this.network }));
  }

  async getPricePerShare(_params: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    // @TODO Use https://arbiscan.io/address/0x3e0199792ce69dc29a0a36146bfa68bd7c8d6633
    return [];
  }

  async getPrice() {
    const { data: liquidityAsset } = await axios.get<LiquidityAsset>('/api/liquidityAsset', {
      baseURL: 'https://app.mux.network',
    });

    return liquidityAsset.muxLPPrice;
  }
}
