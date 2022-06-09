import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { VotiumClaimableBalancesHelper } from '../helpers/votium.rewards.balance-helper';
import { VOTIUM_DEFINITION } from '../votium.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(VOTIUM_DEFINITION.id, network)
export class EthereumVotiumBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(VotiumClaimableBalancesHelper)
    private readonly rewardsBalancesHelper: VotiumClaimableBalancesHelper,
  ) {}

  private async getRewardsBalances(address: string) {
    return this.rewardsBalancesHelper.getBalances({ address });
  }

  async getBalances(address: string) {
    const [rewardsBalances] = await Promise.all([this.getRewardsBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Claimable',
        assets: rewardsBalances,
      },
    ]);
  }
}
