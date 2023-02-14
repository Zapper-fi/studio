import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { RedactedRewardDistributor__factory } from '../contracts/ethers';

const BTRFLY_REWARDS =
  'https://raw.githubusercontent.com/redacted-cartel/distributions/master/protocol-v2/latest/btrfly.json';
const ETH_REWARDS =
  'https://raw.githubusercontent.com/redacted-cartel/distributions/master/protocol-v2/latest/eth.json';
export type RedactedReward = {
  account: string;
  amount: string;
};

/**
 * Retrieves claimable rewards for an account.
 * See: https://github.com/redacted-cartel/distributions/blob/master/protocol-v2/README.md#important-note
 * for reference on how this works
 */
@Injectable()
export class RedactedEarningsResolver {
  @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit;

  public async getClaimableAmount(address: string, network: Network): Promise<BigNumber[]> {
    let btrflyClaimable = BigNumber.from(0);
    let ethClaimable = BigNumber.from(0);
    try {
      const [totalBtrfly, totalEth] = await this.getTotalRewards(address);
      const [claimedBtrfly, claimedEth] = await this.getClaimedRewards(address, network);

      // Total Rewards - What's already been claimed = What's claimable now
      btrflyClaimable = totalBtrfly.gt(0) ? totalBtrfly.sub(claimedBtrfly) : BigNumber.from(0);
      ethClaimable = totalEth.gt(0) ? totalEth.sub(claimedEth) : BigNumber.from(0);
    } catch (err) {
      console.error(err);
    }
    return [btrflyClaimable, ethClaimable];
  }

  private async getTotalRewards(address: string) {
    const [bData, eData] = await this.getRawData();
    const bTotal = bData.find(r => r.account.toLowerCase() === address)?.amount ?? '0';
    const eTotal = eData.find(r => r.account.toLowerCase() === address)?.amount ?? '0';

    const btrfly = BigNumber.from(bTotal);
    const eth = BigNumber.from(eTotal);

    return [btrfly, eth];
  }

  private async getClaimedRewards(address: string, network: Network) {
    const contract = RedactedRewardDistributor__factory.connect(
      '0xd7807e5752b368a6a64b76828aaff0750522a76e', // Reward Distributor
      this.appToolkit.getNetworkProvider(network),
    );
    const btrflyClaimed = await contract.claimed(
      '0xc55126051b22ebb829d00368f4b12bde432de5da', // BTRFLY mapping
      address,
    );

    const ethClaimed = await contract.claimed(
      '0xa52fd396891e7a74b641a2cb1a6999fcf56b077e', // ETH mapping
      address,
    );

    return [btrflyClaimed, ethClaimed];
  }

  @Cache({
    key: `studio:redacted-cartel:claimable-rewards-raw-data`,
    ttl: 60 * 60 * 24, // 24hrs
  })
  private async getRawData(): Promise<RedactedReward[][]> {
    const [btrflyResult, ethResult] = await Promise.allSettled([
      axios.get<RedactedReward[]>(BTRFLY_REWARDS),
      axios.get<RedactedReward[]>(ETH_REWARDS),
    ]);

    const btrflyData = btrflyResult.status === 'fulfilled' ? btrflyResult.value?.data : [];
    const ethData = ethResult.status === 'fulfilled' ? ethResult.value?.data : [];

    return [btrflyData, ethData];
  }
}
