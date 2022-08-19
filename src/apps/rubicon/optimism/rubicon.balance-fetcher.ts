import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { RUBICON_DEFINITION } from '../rubicon.definition';

const network = Network.OPTIMISM_MAINNET;

// Test via http://localhost:5001/apps/rubicon/balances?addresses[]=<ADDRESS>&network=optimism
@Register.BalanceFetcher(RUBICON_DEFINITION.id, network)
export class OptimismRubiconBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBathTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: RUBICON_DEFINITION.id,
      groupId: RUBICON_DEFINITION.groups.bath.id,
      network: network,
    });
  }

  async getBalances(address: string) {
    const [bathTokenBalances] = await Promise.all([this.getBathTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Bath Tokens',
        assets: bathTokenBalances,
      },
    ]);
  }
}
