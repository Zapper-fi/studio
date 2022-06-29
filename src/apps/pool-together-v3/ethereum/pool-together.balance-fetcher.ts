import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherClaimableTokenBalancesHelper } from '../helpers/pool-together-v3.claimable.balance-helper';
import { PoolTogetherAirdropTokenBalancesHelper } from '../helpers/pool-together.airdrop.balance-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, network)
export class EthereumPoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherClaimableTokenBalancesHelper,
    @Inject(PoolTogetherAirdropTokenBalancesHelper)
    private readonly airdropTokenBalancesHelper: PoolTogetherAirdropTokenBalancesHelper,
  ) {}

  async getV3TokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
      address,
    });
  }

  async getV3PodTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.v3Pod.id,
      address,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableTokenBalancesHelper.getBalances({
      address,
      network,
    });
  }

  async getAirdropBalances(address: string) {
    return this.airdropTokenBalancesHelper.getBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [v3TokenBalances, podTokenBalances, claimableBalances, airdropBalances] = await Promise.all([
      this.getV3TokenBalances(address),
      this.getV3PodTokenBalances(address),
      this.getClaimableBalances(address),
      this.getAirdropBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Prize Pools',
        assets: v3TokenBalances,
      },
      {
        label: 'Prize Pods',
        assets: podTokenBalances,
      },
      {
        label: 'Rewards',
        assets: claimableBalances,
      },
      {
        label: 'Airdrops',
        assets: airdropBalances,
      },
    ]);
  }
}
