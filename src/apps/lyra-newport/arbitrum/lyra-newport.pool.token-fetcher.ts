import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { LyraNewportContractFactory, LyraLiquidityToken } from '../contracts';

type LyraMainnetAddresses = Record<
  string,
  {
    contractName: string;
    source: string;
    address: string;
    txn: string;
    blockNumber: number;
  }
>;

// TODO: find better way to determine available markets
type QueryResponse = {
  markets: {
    id: string;
    baseAddress: string;
    quoteAddress: string;
    liquidityPool: {
      id: string;
    };
  }[];
};
const QUERY = gql`
  {
    markets(where: { isRemoved: false }) {
      id
      baseAddress
      quoteAddress
      liquidityPool {
        id
      }
    }
  }
`;

@PositionTemplate()
export class ArbitrumLyraNewportPoolTokenFetcher extends AppTokenTemplatePositionFetcher<LyraLiquidityToken> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraNewportContractFactory) protected readonly contractFactory: LyraNewportContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LyraLiquidityToken {
    return this.contractFactory.lyraLiquidityToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const registryContract = this.contractFactory.lyraRegistry({
      address: "0x6c87e4364Fd44B0D425ADfD0328e56b89b201329",
      network: this.network,
    });

    const marketsResponse = await gqlFetch<QueryResponse>({
      endpoint: 'https://api.lyra.finance/subgraph/arbitrum/v2/api',
      query: QUERY,
    });

    const markets = await Promise.all(
      marketsResponse.markets.map(market => multicall.wrap(registryContract).marketAddresses(market.id)),
    );

    return markets.map(market => market.liquidityToken);
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', network: this.network }];
  }

  async getPricePerShare({
    appToken,
    contract,
    multicall,
  }: GetPricePerShareParams<LyraLiquidityToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const pool = await contract.liquidityPool();
    const poolContract = this.contractFactory.lyraLiquidityPool({ address: pool, network: this.network });
    const ratioRaw = await multicall.wrap(poolContract).getTokenPrice();
    const ratio = Number(ratioRaw) / 10 ** appToken.tokens[0].decimals;
    return [ratio];
  }
}
