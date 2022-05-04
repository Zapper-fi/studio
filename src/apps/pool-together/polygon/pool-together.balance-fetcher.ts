import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherClaimableTokenBalancesHelper } from '../helpers/pool-together-v3.claimable.balance-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, Network.POLYGON_MAINNET)
export class PolygonPoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherClaimableTokenBalancesHelper,
  ) {}

  async getV4TokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.POLYGON_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.v4.id,
      address,
    });
  }

  async getV3TokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.POLYGON_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
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
    const [v4TokenBalance, v3TokenBalances, claimableBalances] = await Promise.all([
      this.getV4TokenBalances(address),
      this.getV3TokenBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: v4TokenBalance,
      },
      {
        label: 'Prize Pools',
        assets: v3TokenBalances,
      },
      {
        label: 'Rewards',
        assets: compact(claimableBalances),
      },
    ]);
  }
}
