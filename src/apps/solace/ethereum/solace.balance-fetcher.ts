import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SolaceBondBalanceHelper } from '../helpers/SolaceBondBalanceHelper';
import { SolacePolicyBalanceHelper } from '../helpers/SolacePolicyBalanceHelper';
import { SolaceXSBalanceHelper } from '../helpers/SolaceXSBalanceHelper';
import { SOLACE_DEFINITION } from '../solace.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(SOLACE_DEFINITION.id, network)
export class EthereumSolaceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceBondBalanceHelper)
    private readonly solaceBondBalanceHelper: SolaceBondBalanceHelper,
    @Inject(SolacePolicyBalanceHelper)
    private readonly solacePolicyBalanceHelper: SolacePolicyBalanceHelper,
    @Inject(SolaceXSBalanceHelper)
    private readonly solaceXSBalanceHelper: SolaceXSBalanceHelper,
  ) {}

  async getScpBalance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.scp.id,
      network,
    });
  }

  async getXSolaceV1Balance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.xsolacev1.id,
      network,
    });
  }

  async getXSLockerBalance(address: string) {
    return this.solaceXSBalanceHelper.getBalances({
      address,
      network,
    });
  }

  async getBondBalance(address: string) {
    return this.solaceBondBalanceHelper.getBalances({
      address,
      network,
    });
  }

  async getPolicyBalance(address: string) {
    return this.solacePolicyBalanceHelper.getBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [scpBal, xsolaceBal, xslockerBal, bondBal, policyBal] = await Promise.all([
      this.getScpBalance(address),
      this.getXSolaceV1Balance(address),
      this.getXSLockerBalance(address),
      this.getBondBalance(address),
      this.getPolicyBalance(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'SCP',
        assets: scpBal,
      },
      {
        label: 'xSOLACEv1',
        assets: xsolaceBal,
      },
      {
        label: 'xsLocker',
        assets: xslockerBal,
      },
      {
        label: 'Bonds',
        assets: bondBal,
      },
      {
        label: 'Policies',
        assets: policyBal,
      },
    ]);
  }
}
