import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LIDO_DEFINITION } from '../lido.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(LIDO_DEFINITION.id, network)
export class EthereumLidoBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const [stethBalance, wstethBalance] = await Promise.all([
      this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
        address,
        appId: LIDO_DEFINITION.id,
        groupId: LIDO_DEFINITION.groups.steth.id,
        network: Network.ETHEREUM_MAINNET,
      }),
      this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
        address,
        appId: LIDO_DEFINITION.id,
        groupId: LIDO_DEFINITION.groups.wsteth.id,
        network: Network.ETHEREUM_MAINNET,
      }),
    ]);
    return presentBalanceFetcherResponse([
      {
        label: 'stETH',
        assets: stethBalance,
      },
      {
        label: 'wstETH',
        assets: wstethBalance,
      },
    ]);
  }
}
