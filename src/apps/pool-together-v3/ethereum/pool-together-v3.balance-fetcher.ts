import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV3AirdropTokenBalancesHelper } from '../helpers/pool-together-v3.airdrop.balance-helper';
import { PoolTogetherV3ClaimableTokenBalancesHelper } from '../helpers/pool-together-v3.claimable.balance-helper';
import { POOL_TOGETHER_V3_DEFINITION } from '../pool-together-v3.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_V3_DEFINITION.id, network)
export class EthereumPoolTogetherV3BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherV3ClaimableTokenBalancesHelper,
    @Inject(PoolTogetherV3AirdropTokenBalancesHelper)
    private readonly airdropTokenBalancesHelper: PoolTogetherV3AirdropTokenBalancesHelper,
  ) {}

  async getTicketBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_V3_DEFINITION.id,
      groupId: POOL_TOGETHER_V3_DEFINITION.groups.ticket.id,
      address,
    });
  }

  async getPodTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_V3_DEFINITION.id,
      groupId: POOL_TOGETHER_V3_DEFINITION.groups.pod.id,
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
    const [ticketBalances, podTokenBalances, claimableBalances, airdropBalances] = await Promise.all([
      this.getTicketBalances(address),
      this.getPodTokenBalances(address),
      this.getClaimableBalances(address),
      this.getAirdropBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Prize Pools',
        assets: ticketBalances,
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
