import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { Cache } from '~cache/cache.decorator';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerContractFactory } from '../contracts';

type BadgerClaimableContractPositionBalanceHelperParams = {
  address: string;
  network: Network;
};

type RewardTreeResponse = {
  cumulativeAmounts: string[];
  cycle: string;
  index: string;
  node: string;
  proof: string[];
  tokens: string[];
  user: string;
};

@Injectable()
export class BadgerClaimableContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BadgerContractFactory) private readonly contractFactory: BadgerContractFactory,
  ) {}

  @Cache({
    key: ({ address, network }: BadgerClaimableContractPositionBalanceHelperParams) =>
      `apps-v3:${BADGER_DEFINITION.id}:${network}:accumulated-rewards:${address}`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getCachedAccumulatedRewards({ address }: BadgerClaimableContractPositionBalanceHelperParams) {
    const checksumAddress = ethers.utils.getAddress(address);
    const { data } = await Axios.get<RewardTreeResponse>(
      `https://api.badger.finance/v2/reward/tree/${checksumAddress}`,
    ).catch(() => ({ data: { tokens: [] as string[], cumulativeAmounts: [] as string[] } }));

    const accumulatedRewardsData = data.tokens.map((tokenAddress, index) => ({
      rewardTokenAddress: tokenAddress.toLowerCase(),
      rewardTokenBalanceRaw: data.cumulativeAmounts[index],
    }));

    return accumulatedRewardsData;
  }

  async getBalances({ address, network }: BadgerClaimableContractPositionBalanceHelperParams) {
    const accumulatedRewardsData = await this.getCachedAccumulatedRewards({ address, network });

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      network,
      appId: BADGER_DEFINITION.id,
      groupId: BADGER_DEFINITION.groups.claimable.id,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const badgerTreeContract = this.contractFactory.badgerTree(contractPosition);
        const rewardToken = contractPosition.tokens.find(isClaimable);
        const match = accumulatedRewardsData.find(v => v.rewardTokenAddress === rewardToken?.address);
        if (!rewardToken || !match) return [];

        let cumulativeAmount = match.rewardTokenBalanceRaw;
        let claimed = await multicall
          .wrap(badgerTreeContract)
          .claimed(address, rewardToken.address)
          .then(v => v.toString());

        // Handle DIGG amounts as shares
        if (rewardToken.symbol === 'DIGG') {
          const diggTokenContract = this.contractFactory.badgerDiggToken(rewardToken);
          const sharesPerFragment = await multicall.wrap(diggTokenContract)._sharesPerFragment();
          cumulativeAmount = new BigNumber(cumulativeAmount)
            .dividedBy(new BigNumber(sharesPerFragment.toString()))
            .toFixed(0);
          claimed = new BigNumber(claimed).dividedBy(new BigNumber(sharesPerFragment.toString())).toFixed(0);
        }

        const claimableBalanceRaw = new BigNumber(cumulativeAmount).minus(claimed).toFixed(0);
        return [drillBalance(rewardToken, claimableBalanceRaw)];
      },
    });
  }
}
