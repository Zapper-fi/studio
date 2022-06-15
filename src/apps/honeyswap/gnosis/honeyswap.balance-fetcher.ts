import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { HONEYSWAP_DEFINITION } from '../honeyswap.definition';

const network = Network.GNOSIS_MAINNET;
const appId = HONEYSWAP_DEFINITION.id;

@Register.BalanceFetcher(HONEYSWAP_DEFINITION.id, network)
export class GnosisHoneyswapBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: HONEYSWAP_DEFINITION.groups.pool.id,
    });
  }

  async getBalances(address: string) {
    const [poolBalances] = await Promise.all([this.getPoolBalances(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
    ]);
  }
}
