import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TENDERIZE_DEFINITION } from '../tenderize.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(TENDERIZE_DEFINITION.id, network)
export class EthereumTenderizeBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTenderTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: TENDERIZE_DEFINITION.id,
      groupId: TENDERIZE_DEFINITION.groups.tendertokens.id,
      network,
    });
  }

  async getSwapTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: TENDERIZE_DEFINITION.id,
      groupId: TENDERIZE_DEFINITION.groups.swaptokens.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [tenderTokenBalances, swapTokenBalances] = await Promise.all([
      this.getTenderTokenBalances(address),
      this.getSwapTokenBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'TenderTokens',
        assets: tenderTokenBalances,
      },
      {
        label: 'SwapTokens',
        assets: swapTokenBalances,
      },
    ]);
  }
}
