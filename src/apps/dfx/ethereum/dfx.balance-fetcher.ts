import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { DFX_DEFINITION } from '../dfx.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(DFX_DEFINITION.id, network)
export class EthereumDfxBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getCurveTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: DFX_DEFINITION.id,
      groupId: DFX_DEFINITION.groups.curve.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [curveTokenBalances] = await Promise.all([this.getCurveTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'DFX Curves',
        assets: curveTokenBalances,
      },
    ]);
  }
}
