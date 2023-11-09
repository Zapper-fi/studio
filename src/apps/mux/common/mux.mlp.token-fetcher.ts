import { Inject } from '@nestjs/common';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  DefaultAppTokenDefinition,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { MuxViemContractFactory } from '../contracts';

export type LiquidityAsset = {
  muxLPTotalBalance: number;
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
  abstract poolAddress: string;
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return [this.mlpAddress];
  }

  async getUnderlyingTokenDefinitions({
    tokenLoader,
  }: GetUnderlyingTokensParams<Erc20, DefaultAppTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    const response = await gqlFetch<TokensResponse>({
      endpoint: this.subgraphUrl,
      query: ASSETS_TOKENS_QUERY,
    });

    const tokensRaw = (response.assets ?? []).filter(v => v.tokenAddress !== ZERO_ADDRESS);
    const baseTokens = await tokenLoader.getMany(
      tokensRaw.map(v => ({ address: v.tokenAddress, network: this.network })),
    );

    return compact(baseTokens).map(v => ({ address: v.address, network: this.network }));
  }

  async getSupply() {
    const { data: liquidityAsset } = await axios.get<LiquidityAsset>('/api/liquidityAsset', {
      baseURL: 'https://app.mux.network',
    });

    return new BigNumber(liquidityAsset.muxLPTotalBalance).times(10 ** 18).toFixed(0);
  }

  async getPricePerShare({ appToken }: GetPricePerShareParams<Erc20>) {
    return appToken.tokens.map(() => 0);
  }

  async getPrice() {
    const { data: liquidityAsset } = await axios.get<LiquidityAsset>('/api/liquidityAsset', {
      baseURL: 'https://app.mux.network',
    });

    return liquidityAsset.muxLPPrice;
  }
}
