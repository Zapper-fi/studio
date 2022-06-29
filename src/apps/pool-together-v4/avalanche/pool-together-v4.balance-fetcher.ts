import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4ClaimableTokenBalancesHelper } from '../helpers/pool-together-v4.claimable.balance-helper';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_V4_DEFINITION.id, network)
export class AvalanchePoolTogetherV4BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherV4ClaimableTokenBalancesHelper,
  ) {}

  async getTicketBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_V4_DEFINITION.id,
      groupId: POOL_TOGETHER_V4_DEFINITION.groups.ticket.id,
      address,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableTokenBalancesHelper.getBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [ticketBalance, claimableBalances] = await Promise.all([
      this.getTicketBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: ticketBalance,
      },
      {
        label: 'Rewards',
        assets: claimableBalances,
      },
    ]);
  }
}
