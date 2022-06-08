import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TEMPUS_DEFINITION } from '../tempus.definition';

const network = Network.ETHEREUM_MAINNET;
const appId = TEMPUS_DEFINITION.id;

@Register.BalanceFetcher(TEMPUS_DEFINITION.id, network)
export class EthereumTempusBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: TEMPUS_DEFINITION.groups.pool.id,
      network,
    });
  }

  private async getAMMTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: TEMPUS_DEFINITION.groups.amm.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, AMMTokenBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getAMMTokenBalances(address),
    ]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Farms',
        assets: AMMTokenBalances,
      },
    ]);
  }
}
