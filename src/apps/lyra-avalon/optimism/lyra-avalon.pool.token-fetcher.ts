import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { LyraAvalonContractFactory, LyraLiquidityToken } from '../contracts';

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
export class OptimismLyraAvalonPoolTokenFetcher extends AppTokenTemplatePositionFetcher<LyraLiquidityToken> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) protected readonly contractFactory: LyraAvalonContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LyraLiquidityToken {
    return this.contractFactory.lyraLiquidityToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const dataUrl = 'https://raw.githubusercontent.com/lyra-finance/subgraph/master/addresses/mainnet-ovm/lyra.json';
    const { data: addresses } = await Axios.get<LyraMainnetAddresses>(dataUrl);
    const registryContract = this.contractFactory.lyraRegistry({
      address: addresses.LyraRegistry.address,
      network: this.network,
    });

    const marketsResponse = await this.appToolkit.helpers.theGraphHelper.requestGraph<QueryResponse>({
      endpoint: 'https://subgraph.satsuma-prod.com/lyra/optimism-mainnet/api',
      query: QUERY,
    });

    const markets = await Promise.all(
      marketsResponse.markets.map(market => multicall.wrap(registryContract).marketAddresses(market.id)),
    );

    return markets.map(market => market.liquidityTokens);
  }

  async getUnderlyingTokenAddresses() {
    return ['0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9']; // sUSD
  }

  async getPricePerShare({
    appToken,
    contract,
    multicall,
  }: GetPricePerShareParams<LyraLiquidityToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const pool = await contract.liquidityPool();
    const poolContract = this.contractFactory.lyraLiquidityPool({ address: pool, network: this.network });
    const ratio = await multicall.wrap(poolContract).getTokenPrice();
    return Number(ratio) / 10 ** appToken.tokens[0].decimals;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<LyraLiquidityToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<LyraLiquidityToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<LyraLiquidityToken>) {
    return 0;
  }
}
