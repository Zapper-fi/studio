import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV3ClaimableTokenBalancesHelper } from '../helpers/pool-together-v3.claimable.balance-helper';
import { POOL_TOGETHER_V3_DEFINITION } from '../pool-together-v3.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_V3_DEFINITION.id, network)
export class PolygonPoolTogetherV3BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherV3ClaimableTokenBalancesHelper,
  ) {}

  async getTicketBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_V3_DEFINITION.id,
      groupId: POOL_TOGETHER_V3_DEFINITION.groups.ticket.id,
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
    const [ticketBalances, claimableBalances] = await Promise.all([
      this.getTicketBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Prize Pools',
        assets: ticketBalances,
      },
      {
        label: 'Rewards',
        assets: claimableBalances,
      },
    ]);
  }
}
