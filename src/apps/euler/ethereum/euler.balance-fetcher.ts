import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(EULER_DEFINITION.id, network)
export class EthereumEulerBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getETokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: EULER_DEFINITION.id,
      groupId: EULER_DEFINITION.groups.eToken.id,
      network: network,
    });
  }

  async getDTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: EULER_DEFINITION.id,
      groupId: EULER_DEFINITION.groups.dToken.id,
      network: network,
    });
  }

  async getPTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: EULER_DEFINITION.id,
      groupId: EULER_DEFINITION.groups.pToken.id,
      network: network,
    });
  }

  async getBalances(address: string) {
    const [dTokenBalances, eTokenBalances, pTokenBalances] = await Promise.all([
      this.getDTokenBalances(address),
      this.getETokenBalances(address),
      this.getPTokenBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'dTokens',
        assets: dTokenBalances,
      },
      {
        label: 'eTokens',
        assets: eTokenBalances,
      },
      {
        label: 'pTokens',
        assets: pTokenBalances,
      },
    ]);
  }
}
