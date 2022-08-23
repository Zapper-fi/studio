import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';

const name = BEEFY_DEFINITION.name;
const appId = BEEFY_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class OptimismBeefyBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const assets = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: BEEFY_DEFINITION.groups.vault.id,
      network,
    });

    return presentBalanceFetcherResponse([
      {
        label: name,
        assets,
      },
    ]);
  }
}
