import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MYC_LENDING_ADDRESS, MYC_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS } from './mycelium.constants';

type MyceliumLendingContractPositionHelperParams = {
  address: string;
  network: Network;
};

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.lending.id;

@Injectable()
export class MyceliumLendingBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
  ) {}

  async getBalance({ address, network }: MyceliumLendingContractPositionHelperParams) {
    const position = this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId,
      network,
      resolveBalances: async ({ address, multicall }) => {
        const lendingContract = this.myceliumContractFactory.myceliumLending({
          address: MYC_LENDING_ADDRESS,
          network,
        });
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

        const suppliedToken = baseTokens.find(token => token.address === MYC_TOKEN_ADDRESS);
        const rewardToken = baseTokens.find(token => token.address === WETH_TOKEN_ADDRESS);

        if (!suppliedToken || !rewardToken) return [];

        const [balanceRaw, cumulativeRewardsRaw, claimedRewardsRaw] = await Promise.all([
          multicall.wrap(lendingContract).balanceOf(address),
          multicall.wrap(lendingContract).userCumulativeEthRewards(address),
          multicall.wrap(lendingContract).userEthRewardsClaimed(address),
        ]);
        const cumulativeRewards = Number(cumulativeRewardsRaw) / 10 ** suppliedToken.decimals;
        const claimedRewards = Number(claimedRewardsRaw) / 10 ** rewardToken.decimals;

        return [
          drillBalance(suppliedToken, balanceRaw.toString()),
          drillBalance(rewardToken, (cumulativeRewards - claimedRewards).toString()),
        ];
      },
    });
    return position;
  }
}
