import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleClaimableBalanceHelper } from '../helpers/aave-safety-module.claimable.balance-helper';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(AAVE_SAFETY_MODULE_DEFINITION.id, network)
export class EthereumAaveSafetyModuleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleClaimableBalanceHelper)
    private readonly claimableBalanceHelper: AaveSafetyModuleClaimableBalanceHelper,
  ) {}

  private async getStkAaveTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: AAVE_SAFETY_MODULE_DEFINITION.id,
      groupId: AAVE_SAFETY_MODULE_DEFINITION.groups.stkAave.id,
      network,
    });
  }

  private async getStkAbptTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: AAVE_SAFETY_MODULE_DEFINITION.id,
      groupId: AAVE_SAFETY_MODULE_DEFINITION.groups.stkAbpt.id,
      network,
    });
  }

  private async getAbptTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: AAVE_SAFETY_MODULE_DEFINITION.id,
      groupId: AAVE_SAFETY_MODULE_DEFINITION.groups.abpt.id,
      network,
    });
  }

  private async getClaimableBalances(address: string) {
    return this.claimableBalanceHelper.getBalances({ address });
  }

  async getBalances(address: string) {
    const [stkAaveBalances, stkAbptBalances, abptBalances, claimableBalances] = await Promise.all([
      this.getStkAaveTokenBalances(address),
      this.getStkAbptTokenBalances(address),
      this.getAbptTokenBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'stkAAVE',
        assets: stkAaveBalances,
      },
      {
        label: 'stkABPT',
        assets: stkAbptBalances,
      },
      {
        label: 'ABPT',
        assets: abptBalances,
      },
      {
        label: 'Rewards',
        assets: claimableBalances,
      },
    ]);
  }
}
