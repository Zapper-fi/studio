import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { HEDGEFARM_DEFINITION } from '../hedgefarm.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(HEDGEFARM_DEFINITION.id, network)
export class AvalancheHedgefarmBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getAlphaOneTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: HEDGEFARM_DEFINITION.id,
      groupId: HEDGEFARM_DEFINITION.groups.alphaOne.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  async getBalances(address: string) {
    const alphaOneTokenBalance = await this.getAlphaOneTokenBalances(address)
    return presentBalanceFetcherResponse([{
      label: "Alpha #1",
      assets: alphaOneTokenBalance
    }]);
  }
}
