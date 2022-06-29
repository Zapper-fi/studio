import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AURORA_PLUS_DEFINITION } from '../aurora-plus.definition';
import { AuroraPlusContractFactory } from '../contracts';

import getStakingBalance from './helpers/getStakingBalance';

const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(AURORA_PLUS_DEFINITION.id, network)
export class AuroraAuroraPlusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuroraPlusContractFactory) private readonly auroraPlusContractFactory: AuroraPlusContractFactory,
  ) {}

  async getBalances(address: string) {
    const tokenBalances = await getStakingBalance(address, this.appToolkit, this.auroraPlusContractFactory);
    return presentBalanceFetcherResponse([{ label: 'Staked Aurora', assets: tokenBalances }]);
  }
}
