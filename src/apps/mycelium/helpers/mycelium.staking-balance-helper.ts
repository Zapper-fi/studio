import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MYC_STAKING_ADDRESS, MYC_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } from './mycelium.constants';

type MyceliumStakingContractPositionHelperParams = {
  address: string;
  network: Network;
};

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.staking.id;

@Injectable()
export class MyceliumStakingBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
  ) {}

  async getBalance({ address, network }: MyceliumStakingContractPositionHelperParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId,
      network,
      resolveBalances: async ({ address, multicall }) => {
        const stakingContract = this.myceliumContractFactory.myceliumStaking({
          address: MYC_STAKING_ADDRESS,
          network,
        });

        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

        const suppliedToken = baseTokens.find(token => token.address === MYC_TOKEN_ADDRESS);
        const rewardToken = baseTokens.find(token => token.address === WETH_TOKEN_ADDRESS);

        if (!suppliedToken || !rewardToken) return [];

        const [balanceRaw, cumulativeRewardsRaw, claimedRewardsRaw] = await Promise.all([
          multicall.wrap(stakingContract).balanceOf(address),
          multicall.wrap(stakingContract).userCumulativeEthRewards(address),
          multicall.wrap(stakingContract).userEthRewardsClaimed(address),
        ]);

        const cumulativeRewards = Number(cumulativeRewardsRaw) / 10 ** suppliedToken.decimals;
        const claimedRewards = Number(claimedRewardsRaw) / 10 ** rewardToken.decimals;

        return [
          drillBalance(suppliedToken, balanceRaw.toString()),
          drillBalance(rewardToken, (cumulativeRewards - claimedRewards).toString()),
        ];
      },
    });
  }
}
