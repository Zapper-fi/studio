import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { PieDaoViemContractFactory } from '../contracts';
import { PieDaoVoteLockedDough } from '../contracts/viem';

@PositionTemplate()
export class EthereumPieDaoVotingEscrowContractPositionFether extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  PieDaoVoteLockedDough,
  PieDaoVoteLockedDough
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x6bd0d8c8ad8d3f1f97810d5cc57e9296db73dc45';
  rewardAddress = '0x6bd0d8c8ad8d3f1f97810d5cc57e9296db73dc45';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PieDaoViemContractFactory) protected readonly contractFactory: PieDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): PieDaoVoteLockedDough {
    return this.contractFactory.pieDaoVoteLockedDough({ address, network: this.network });
  }

  getRewardContract(address: string): PieDaoVoteLockedDough {
    return this.contractFactory.pieDaoVoteLockedDough({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: PieDaoVoteLockedDough) {
    return contract.depositToken();
  }

  async getRewardTokenAddress(contract: PieDaoVoteLockedDough) {
    return contract.depositToken();
  }

  async getEscrowedTokenBalance(address: string, contract: PieDaoVoteLockedDough) {
    const userData = await contract.getStakingData(address);
    return userData.accountVeTokenBalance;
  }

  async getRewardTokenBalance(address: string, contract: PieDaoVoteLockedDough): Promise<BigNumberish> {
    const userData = await contract.getStakingData(address);
    return userData.accountWithdrawableRewards.sub(userData.accountWithdrawnRewards);
  }
}
