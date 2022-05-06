import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ClaimableContractPositionBalanceHelper } from '../helpers/balancer-v2.claimable.contract-position-balance-helper';

const appId = BALANCER_V2_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class ArbitrumBalancerV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(BalancerV2ClaimableContractPositionBalanceHelper)
    private readonly balancerV2ClaimableContractPositionBalanceHelper: BalancerV2ClaimableContractPositionBalanceHelper,
  ) {}

  async getPoolBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BALANCER_V2_DEFINITION.groups.pool.id,
    });
  }

  async getClaimableBalances(address: string) {
    return this.balancerV2ClaimableContractPositionBalanceHelper.getContractPositionBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [poolBalances, claimableBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getClaimableBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Claimable',
        assets: claimableBalances,
      },
    ]);
  }
}
