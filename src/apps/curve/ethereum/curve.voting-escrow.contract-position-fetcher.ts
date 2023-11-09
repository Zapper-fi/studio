import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { CurveContractFactory, CurveVotingEscrow, CurveVotingEscrowReward } from '../contracts';

@PositionTemplate()
export class EthereumCurveVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  CurveVotingEscrow,
  CurveVotingEscrowReward
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2';
  rewardAddress = '0xa464e6dcda8ac41e03616f95f4bc98a13b8922dc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): CurveVotingEscrow {
    return this.contractFactory.curveVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): CurveVotingEscrowReward {
    return this.contractFactory.curveVotingEscrowReward({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: CurveVotingEscrow) {
    return contract.token();
  }

  async getRewardTokenAddress(contract: CurveVotingEscrowReward) {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: CurveVotingEscrow) {
    return contract.locked(address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: CurveVotingEscrowReward) {
    return contract.callStatic['claim()']({ from: address });
  }
}
