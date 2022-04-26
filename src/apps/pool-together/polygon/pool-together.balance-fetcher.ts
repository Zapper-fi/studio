import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherClaimableTokenBalancesHelper } from '../helpers/pool-together.claimable.balance-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, Network.POLYGON_MAINNET)
export class PolygonPoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherClaimableTokenBalancesHelper,
  ) {}

  async getV4TokenBalance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.POLYGON_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getPrizeTicketTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.POLYGON_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.prizeTicket.id,
      address,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableTokenBalancesHelper.getBalances({
      address,
      network: Network.POLYGON_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [v4TokenBalance, prizeTicketTokenBalances, claimableBalances] = await Promise.all([
      this.getV4TokenBalance(address),
      this.getPrizeTicketTokenBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: v4TokenBalance,
      },
      {
        label: 'Prize Pools',
        assets: prizeTicketTokenBalances,
      },
      {
        label: 'Rewards',
        assets: compact(claimableBalances),
      },
    ]);
  }
}
