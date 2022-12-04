import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { ConvexContractFactory } from '../contracts';
import { ConvexVotingEscrow } from '../contracts/ethers/ConvexVotingEscrow';

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
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): ConvexVotingEscrow {
    return this.contractFactory.convexVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): ConvexVotingEscrow {
    return this.contractFactory.convexVotingEscrow({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: ConvexVotingEscrow): Promise<string> {
    return contract.stakingToken();
  }

  async getRewardTokenAddress(contract: ConvexVotingEscrow): Promise<string> {
    return contract.rewardTokens(0);
  }

  async getEscrowedTokenBalance(address: string, contract: ConvexVotingEscrow): Promise<BigNumberish> {
    return contract.lockedBalances(address).then(v => v.total);
  }

  async getRewardTokenBalance(address: string, contract: ConvexVotingEscrow): Promise<BigNumberish> {
    return contract.claimableRewards(address).then(v => v[0].amount);
  }
}
