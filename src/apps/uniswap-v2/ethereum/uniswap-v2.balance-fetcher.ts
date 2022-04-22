import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { UniswapV2TheGraphPoolTokenBalanceHelper } from '../helpers/uniswap-v2.the-graph.pool-token-balance-helper';
import UNISWAP_V2_DEFINITION from '../uniswap-v2.definition';

const appId = UNISWAP_V2_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumUniswapV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2TheGraphPoolTokenBalanceHelper)
    private readonly uniswapV2TheGraphPoolTokenBalanceHelper: UniswapV2TheGraphPoolTokenBalanceHelper,
  ) {}

  private getPoolTokenBalances(address: string) {
    return this.uniswapV2TheGraphPoolTokenBalanceHelper.getBalances({
      appId,
      groupId: UNISWAP_V2_DEFINITION.groups.pool.id,
      network,
      address,
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      symbolPrefix: 'UNI-V2',
    });
  }

  async getBalances(address: string) {
    const balances = await this.getPoolTokenBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: balances,
      },
    ]);
  }
}
