import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LEMMAFINANCE_DEFINITION } from '../lemmafinance.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(LEMMAFINANCE_DEFINITION.id, network)
export class OptimismLemmafinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getUSDLTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: LEMMAFINANCE_DEFINITION.id,
      groupId: LEMMAFINANCE_DEFINITION.groups.usdl.id,
      network: Network.OPTIMISM_MAINNET,
    });
  }

  async getXUSDLTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: LEMMAFINANCE_DEFINITION.id,
      groupId: LEMMAFINANCE_DEFINITION.groups.xusdl.id,
      network: Network.OPTIMISM_MAINNET,
    });
  }

  async getLemmaTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: LEMMAFINANCE_DEFINITION.id,
      groupId: LEMMAFINANCE_DEFINITION.groups.LemmaSynth.id,
      network: Network.OPTIMISM_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [usdlTokenBalances, xusdlTokenBalances, lemmaSythTokenBalances] = await Promise.all([
      this.getUSDLTokenBalances(address),
      this.getXUSDLTokenBalances(address),
      this.getLemmaTokenBalances(address),

    ]);

    return presentBalanceFetcherResponse([
      {
        label: "usdl",
        assets: usdlTokenBalances,
      },
      {
        label: "xusdl",
        assets: xusdlTokenBalances,
      },
      {
        label: "LemmaSynth",
        assets: lemmaSythTokenBalances,
      },
    ]);
  }
}
