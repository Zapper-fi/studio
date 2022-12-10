import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LEMMA_FINANCE_DEFINITION } from '../lemma-finance.definition';

const appId = LEMMA_FINANCE_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class OptimismLemmaFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getUSDLTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LEMMA_FINANCE_DEFINITION.groups.usdl.id,
      network,
    });
  }

  async getXUSDLTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LEMMA_FINANCE_DEFINITION.groups.xUsdl.id,
      network,
    });
  }

  async getSynthTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LEMMA_FINANCE_DEFINITION.groups.synth.id,
      network,
    });
  }

  async getXSynthTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LEMMA_FINANCE_DEFINITION.groups.xSynth.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [usdlTokenBalances, xusdlTokenBalances, lemmaSythTokenBalances, xlemmaSythTokenBalances] = await Promise.all([
      this.getUSDLTokenBalances(address),
      this.getXUSDLTokenBalances(address),
      this.getSynthTokenBalances(address),
      this.getXSynthTokenBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'USDL',
        assets: usdlTokenBalances,
      },
      {
        label: 'xUSDL',
        assets: xusdlTokenBalances,
      },
      {
        label: 'LemmaSynth',
        assets: lemmaSythTokenBalances,
      },
      {
        label: 'xLemmaSynth',
        assets: xlemmaSythTokenBalances,
      },
    ]);
  }
}
