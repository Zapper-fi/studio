import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { ConvexViemContractFactory } from '../contracts';
import { ConvexVotingEscrow, ConvexVotingEscrowContract } from '../contracts/viem/ConvexVotingEscrow';

@PositionTemplate()
export class EthereumConvexVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  ConvexVotingEscrow,
  ConvexVotingEscrow
> {
  groupLabel = 'Vote Locked CVX';
  veTokenAddress = '0x72a19342e8f1838460ebfccef09f6585e32db86e';
  rewardAddress = '0x72a19342e8f1838460ebfccef09f6585e32db86e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexViemContractFactory) protected readonly contractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): ConvexVotingEscrowContract {
    return this.contractFactory.convexVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): ConvexVotingEscrowContract {
    return this.contractFactory.convexVotingEscrow({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: ConvexVotingEscrowContract): Promise<string> {
    return contract.read.stakingToken();
  }

  async getRewardTokenAddress(contract: ConvexVotingEscrowContract): Promise<string> {
    return contract.read.rewardTokens([BigInt(0)]);
  }

  async getEscrowedTokenBalance(address: string, contract: ConvexVotingEscrowContract): Promise<BigNumberish> {
    return contract.read.lockedBalances([address]).then(v => v[0]);
  }

  async getRewardTokenBalance(address: string, contract: ConvexVotingEscrowContract): Promise<BigNumberish> {
    return contract.read.claimableRewards([address]).then(v => v[0].amount);
  }
}
