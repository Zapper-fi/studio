import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ARBOR_FINANCE_DEFINITION } from '../arbor-finance.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ARBOR_FINANCE_DEFINITION.id, network)
export class EthereumArborFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBondTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ARBOR_FINANCE_DEFINITION.id,
      groupId: ARBOR_FINANCE_DEFINITION.groups.arborFinance.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [bondTokenBalances] = await Promise.all([this.getBondTokenBalances(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Bonds',
        assets: bondTokenBalances,
      },
    ]);
  }
}
