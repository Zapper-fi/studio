import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherAirdropTokenBalancesHelper } from '../helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherClaimableTokenBalancesHelper } from '../helpers/pool-together.claimable.balance-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumPoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherClaimableTokenBalancesHelper,
    @Inject(PoolTogetherAirdropTokenBalancesHelper)
    private readonly airdropTokenBalancesHelper: PoolTogetherAirdropTokenBalancesHelper,
  ) {}

  async getV4TokenBalance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.ETHEREUM_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getPrizeTicketTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.ETHEREUM_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.prizeTicket.id,
      address,
    });
  }

  async getPodTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.ETHEREUM_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.pod.id,
      address,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableTokenBalancesHelper.getBalances({
      address,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getAirdropBalances(address: string) {
    return this.airdropTokenBalancesHelper.getBalances({
      address,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [v4TokenBalance, prizeTicketTokenBalances, podTokenBalances, claimableBalances, airdropBalances] =
      await Promise.all([
        this.getV4TokenBalance(address),
        this.getPrizeTicketTokenBalances(address),
        this.getPodTokenBalances(address),
        this.getClaimableBalances(address),
        this.getAirdropBalances(address),
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
        label: 'Prize Pods',
        assets: podTokenBalances,
      },
      {
        label: 'Rewards',
        assets: compact(claimableBalances),
      },
      {
        label: 'Airdrops',
        assets: compact(airdropBalances),
      },
    ]);
  }
}
