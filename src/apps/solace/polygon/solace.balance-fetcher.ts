import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';
import getXSLockerBalance from './helpers/getXSLockerBalance';
import getBondBalance from './helpers/getBondBalance';
import getPolicyBalance from './helpers/getPolicyBalance';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(SOLACE_DEFINITION.id, network)
export class PolygonSolaceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory
  ) {}

  async getBalances(address: string) {
    const [xslockerBal, bondBal, policyBal] = await Promise.all([
      getXSLockerBalance(address, this.appToolkit, this.solaceContractFactory),
      getBondBalance(address, this.appToolkit, this.solaceContractFactory),
      getPolicyBalance(address, this.appToolkit, this.solaceContractFactory),
    ]);
    return presentBalanceFetcherResponse([
      { label: 'xsLocker', assets: xslockerBal },
      { label: 'Bonds', assets: bondBal },
      { label: 'Policies', assets: policyBal },
    ]);
  }
}
