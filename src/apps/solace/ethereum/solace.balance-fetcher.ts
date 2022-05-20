import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';
import getScpBalance from './helpers/getScpBalance';
import getXSolaceV1Balance from './helpers/getXSolaceV1Balance';
import getXSLockerBalance from './helpers/getXSLockerBalance';
import getBondBalance from './helpers/getBondBalance';
import getPolicyBalance from './helpers/getPolicyBalance';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(SOLACE_DEFINITION.id, network)
export class EthereumSolaceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory
  ) {}

  async getBalances(address: string) {
    const [scpBal, xsolaceBal, xslockerBal, bondBal, policyBal] = await Promise.all([
      getScpBalance(address, this.appToolkit),
      getXSolaceV1Balance(address, this.appToolkit),
      getXSLockerBalance(address, this.appToolkit, this.solaceContractFactory),
      getBondBalance(address, this.appToolkit, this.solaceContractFactory),
      getPolicyBalance(address, this.appToolkit, this.solaceContractFactory),
    ]);
    return presentBalanceFetcherResponse([
      { label: 'SCP', assets: scpBal },
      { label: 'xSOLACEv1', assets: xsolaceBal },
      { label: 'xsLocker', assets: xslockerBal },
      { label: 'Bonds', assets: bondBal },
      { label: 'Policies', assets: policyBal },
    ]);
  }
}
