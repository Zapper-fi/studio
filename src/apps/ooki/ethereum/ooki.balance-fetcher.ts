import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OOKI_DEFINITION } from '../ooki.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(OOKI_DEFINITION.id, network)
export class EthereumOokiBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

   private async getPoolTokenBalances(address: string) {
      return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
        network,
        appId: OOKI_DEFINITION.id,
        groupId: OOKI_DEFINITION.groups.ooki.id,
        address,
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
