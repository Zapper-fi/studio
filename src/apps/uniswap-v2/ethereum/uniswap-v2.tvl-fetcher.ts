import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { UniswapV2TheGraphTvlHelper } from '../helpers/uniswap-v2.the-graph.tvl-helper';
import UNISWAP_V2_DEFINITION from '../uniswap-v2.definition';

const appId = UNISWAP_V2_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumUniswapV2TvlFetcher implements TvlFetcher {
  constructor(
    @Inject(UniswapV2TheGraphTvlHelper) private readonly uniswapV2TheGraphTvlHelper: UniswapV2TheGraphTvlHelper,
  ) {}

  async getTvl() {
    return this.uniswapV2TheGraphTvlHelper.getTvl({
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
    });
  }
}
