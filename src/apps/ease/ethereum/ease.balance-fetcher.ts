import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { EASE_DEFINITION } from '../ease.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(EASE_DEFINITION.id, network)
export class EthereumEaseBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getRcaTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: EASE_DEFINITION.id,
      groupId: EASE_DEFINITION.groups.rca.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [rcaTokenBalances] = await Promise.all([this.getRcaTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'RCAs',
        assets: rcaTokenBalances,
      },
    ]);
  }
}
