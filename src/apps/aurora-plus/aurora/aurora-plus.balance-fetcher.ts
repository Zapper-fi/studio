import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AURORA_PLUS_DEFINITION } from '../aurora-plus.definition';
import { AuroraPlusStakingBalanceHelper } from '../helpers/aurora-plus.staking-balance-helper';

const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(AURORA_PLUS_DEFINITION.id, network)
export class AuroraAuroraPlusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AuroraPlusStakingBalanceHelper)
    private readonly auroraPlusStakingBalanceHelper: AuroraPlusStakingBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const tokenBalances = await this.auroraPlusStakingBalanceHelper.getStakingBalance({ address, network });

    return presentBalanceFetcherResponse([{ label: 'Staked Aurora', assets: tokenBalances }]);
  }
}
