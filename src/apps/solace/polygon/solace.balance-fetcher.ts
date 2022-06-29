import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SolaceBondBalanceHelper } from '../helpers/SolaceBondBalanceHelper';
import { SolacePolicyBalanceHelper } from '../helpers/SolacePolicyBalanceHelper';
import { SolaceXSBalanceHelper } from '../helpers/SolaceXSBalanceHelper';
import { SOLACE_DEFINITION } from '../solace.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(SOLACE_DEFINITION.id, network)
export class PolygonSolaceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SolaceBondBalanceHelper)
    private readonly solaceBondBalanceHelper: SolaceBondBalanceHelper,
    @Inject(SolacePolicyBalanceHelper)
    private readonly solacePolicyBalanceHelper: SolacePolicyBalanceHelper,
    @Inject(SolaceXSBalanceHelper)
    private readonly solaceXSBalanceHelper: SolaceXSBalanceHelper,
  ) {}

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
    const [xslockerBal, bondBal, policyBal] = await Promise.all([
      this.getXSLockerBalance(address),
      this.getBondBalance(address),
      this.getPolicyBalance(address),
    ]);

    return presentBalanceFetcherResponse([
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
