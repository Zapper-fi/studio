import { Inject } from '@nestjs/common';

import { SingleVaultTokenDataProps } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { UniswapV2TheGraphTvlHelper } from '~apps/uniswap-v2/helpers/uniswap-v2.the-graph.tvl-helper';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

@Register.TvlFetcher({ appId: TRADER_JOE_DEFINITION.id, network: Network.AVALANCHE_MAINNET })
export class AvalancheTraderJoeTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2TheGraphTvlHelper) private readonly uniswapV2TheGraphTvlHelper: UniswapV2TheGraphTvlHelper,
  ) {}

  async getTvl() {
    const xJoeTokens = await this.appToolkit.getAppTokenPositions<SingleVaultTokenDataProps>({
      appId: TRADER_JOE_DEFINITION.id,
      groupIds: [TRADER_JOE_DEFINITION.groups.xJoe.id],
      network: Network.AVALANCHE_MAINNET,
    });

    const xJoeTvl = xJoeTokens[0]?.dataProps.liquidity ?? 0;
    const poolTvl = await this.uniswapV2TheGraphTvlHelper.getTvl({
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange',
      factoryObjectName: 'factories',
      tvlObjectName: 'liquidityUSD',
    });

    return xJoeTvl + poolTvl;
  }
}
