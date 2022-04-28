import { Inject } from '@nestjs/common';
import request, { gql } from 'graphql-request';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const graphEndpoint = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2';
const currentQuery = gql`
  query pancakeFactories {
    pancakeFactories(first: 1) {
      totalLiquidityUSD
    }
  }
`;

const MASTERCHEF_ADDRESS = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

@Register.TvlFetcher({ appId: PANCAKESWAP_DEFINITION.id, network: Network.BINANCE_SMART_CHAIN_MAINNET })
export class BinanceSmartChainPancakeSwapTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly toolkit: IAppToolkit) {}

  async getTvl() {
    const multicall = this.toolkit.getMulticall(Network.BINANCE_SMART_CHAIN_MAINNET);
    const contract = this.toolkit.globalContracts.erc20({
      address: PANCAKESWAP_DEFINITION.token.address,
      network: Network.BINANCE_SMART_CHAIN_MAINNET,
    });

    const [pancakeFactories, cakeToken, stakedCakeBalance] = await Promise.all([
      request<{ pancakeFactories: { totalLiquidityUSD: string }[] }>(
        graphEndpoint,
        currentQuery,
        {},
        {
          referer: 'https://pancakeswap.finance/',
          origin: 'https://pancakeswap.finance',
        },
      ),
      this.toolkit.getBaseTokenPrice({
        address: PANCAKESWAP_DEFINITION.token.address,
        network: Network.BINANCE_SMART_CHAIN_MAINNET,
      }),
      multicall.wrap(contract).balanceOf(MASTERCHEF_ADDRESS),
    ]);

    const tvlInFactories = Number(pancakeFactories.pancakeFactories[0].totalLiquidityUSD);

    if (!cakeToken) return 0;

    const stakedTvl = this.toolkit
      .getBigNumber(stakedCakeBalance)
      .div(10 ** cakeToken.decimals)
      .multipliedBy(cakeToken.price)
      .toNumber();

    return tvlInFactories + stakedTvl;
  }
}
