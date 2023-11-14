import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { ConcentratorViemContractFactory } from '../contracts';
import { AladdinConcentratorVe, AladdinConcentratorVeRewards } from '../contracts/viem';
import { AladdinConcentratorVeContract } from '../contracts/viem/AladdinConcentratorVe';
import { AladdinConcentratorVeRewardsContract } from '../contracts/viem/AladdinConcentratorVeRewards';

@PositionTemplate()
export class EthereumConcentratorVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  AladdinConcentratorVe,
  AladdinConcentratorVeRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xe4c09928d834cd58d233cd77b5af3545484b4968';
  rewardAddress = '0xa5d9358c60fc9bd2b508eda17c78c67a43a4458c';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) protected readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): AladdinConcentratorVeContract {
    return this.contractFactory.aladdinConcentratorVe({ address, network: this.network });
  }

  getRewardContract(address: string): AladdinConcentratorVeRewardsContract {
    return this.contractFactory.aladdinConcentratorVeRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: AladdinConcentratorVeContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: AladdinConcentratorVeRewardsContract): Promise<BigNumberish> {
    return contract.simulate.claim([address]).then(v => v.result);
  }

  getRewardTokenAddress(contract: AladdinConcentratorVeRewardsContract): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: AladdinConcentratorVeContract): Promise<BigNumberish> {
    return contract.read.balanceOf([address]);
  }
}
