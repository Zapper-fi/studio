import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SINGLE_DEFINITION } from '../single.definition';

const appId = SINGLE_DEFINITION.id;
const groupId = SINGLE_DEFINITION.groups.lending.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(SINGLE_DEFINITION.id, network)
export class CronosSingleBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getVaultTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId,
      network,
    });
  }

  async getBalances(address: string) {
    const [vaultsTokenBalances] = await Promise.all([this.getVaultTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: vaultsTokenBalances,
      },
    ]);
  }
}
