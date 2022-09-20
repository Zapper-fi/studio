import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { PickleContractFactory, PickleVotingEscrow, PickleVotingEscrowReward } from '../contracts';

@PositionTemplate()
export class EthereumPickleVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  PickleVotingEscrow,
  PickleVotingEscrowReward
> {
  groupLabel = 'Voting Escrow';

  veTokenAddress = '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf';
  rewardAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): PickleVotingEscrow {
    return this.contractFactory.pickleVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): PickleVotingEscrowReward {
    return this.contractFactory.pickleVotingEscrowReward({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: PickleVotingEscrow): Promise<string> {
    return contract.token();
  }

  getRewardTokenAddress(contract: PickleVotingEscrowReward): Promise<string> {
    return contract.token();
  }

  getEscrowedTokenBalance(address: string, contract: PickleVotingEscrow): Promise<BigNumberish> {
    return contract.locked(address).then(v => v.amount);
  }

  getRewardTokenBalance(address: string, contract: PickleVotingEscrowReward): Promise<BigNumberish> {
    return contract.callStatic['claim()']({ from: address });
  }
}
