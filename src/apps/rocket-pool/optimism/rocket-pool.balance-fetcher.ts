import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { RocketPoolRethBalanceHelper } from '../helpers/rocket-pool.reth.balance-helper';

import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(ROCKET_POOL_DEFINITION.id, network)
export class OptimismRocketPoolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(RocketPoolRethBalanceHelper) private readonly rocketPoolRethBalanceHelper: RocketPoolRethBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return presentBalanceFetcherResponse(await this.rocketPoolRethBalanceHelper.getBalances(address));
  }
}
