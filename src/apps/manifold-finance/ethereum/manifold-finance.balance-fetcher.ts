import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MANIFOLD_FINANCE_DEFINITION } from '../manifold-finance.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(MANIFOLD_FINANCE_DEFINITION.id, network)
export class EthereumManifoldFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  getStakingBalance = (address: string) => {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: MANIFOLD_FINANCE_DEFINITION.id,
      groupId: MANIFOLD_FINANCE_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
    });
  };

  async getBalances(address: string) {
    const stakedBalances = await this.getStakingBalance(address);

    return presentBalanceFetcherResponse([
      {
        label: 'xFOLD',
        assets: stakedBalances,
      },
    ]);
  }
}
