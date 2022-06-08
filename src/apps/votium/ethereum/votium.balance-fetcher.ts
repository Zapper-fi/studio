import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { VotiumRewardsBalancesHelper } from '../helpers/votium.rewards.balance-helper';

import { VOTIUM_DEFINITION } from '../votium.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(VOTIUM_DEFINITION.id, network)
export class EthereumVotiumBalanceFetcher implements BalanceFetcher {
	constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VotiumRewardsBalancesHelper)
    private readonly rewardsBalancesHelper: VotiumRewardsBalancesHelper,
  ) {}

	private async getRewardsBalances(address: string) {
    return this.rewardsBalancesHelper.getBalances({ address });
  }

	async getBalances(address: string) {
    const [rewardsBalances] = await Promise.all([
      this.getRewardsBalances(address)
    ]);

		const rewards = await Promise.all(
			rewardsBalances.map(async (rewardData) => {
				return rewardData[0]
			})
		);
		console.log(rewards)
    return presentBalanceFetcherResponse([{
			label: 'Rewards',
			assets: rewards,
		}])
  }
}
