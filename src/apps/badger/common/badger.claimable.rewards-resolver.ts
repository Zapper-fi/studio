import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { ethers } from 'ethers';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

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
export class BadgerClaimableRewardsResolver {
  @Cache({
    key: (network: Network, address: string) => `studio:badger:${network}:accumulated-rewards:${address}`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getCachedAccumulatedRewardsData(_network: Network, address: string) {
    const checksumAddress = ethers.utils.getAddress(address);
    const { data } = await Axios.get<RewardTreeResponse>(
      `https://api.badger.finance/v2/reward/tree/${checksumAddress}`,
    ).catch(() => ({ data: { tokens: [] as string[], cumulativeAmounts: [] as string[] } }));

    return data;
  }

  async getVaultDefinitions({ network, address }: BadgerClaimableContractPositionBalanceHelperParams) {
    const data = await this.getCachedAccumulatedRewardsData(network, address);

    const accumulatedRewardsData = data.tokens.map((tokenAddress, index) => ({
      rewardTokenAddress: tokenAddress.toLowerCase(),
      rewardTokenBalanceRaw: data.cumulativeAmounts[index],
    }));

    return accumulatedRewardsData;
  }
}
