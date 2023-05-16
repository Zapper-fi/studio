import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { ConcentratorContractFactory, AladdinConcentratorVe, AladdinConcentratorVeRewards } from '../contracts';

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
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): AladdinConcentratorVe {
    return this.contractFactory.aladdinConcentratorVe({ address, network: this.network });
  }

  getRewardContract(address: string): AladdinConcentratorVeRewards {
    return this.contractFactory.aladdinConcentratorVeRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: AladdinConcentratorVe): Promise<string> {
    return contract.token();
  }

  async getRewardTokenBalance(address: string, contract: AladdinConcentratorVeRewards): Promise<BigNumberish> {
    return contract.callStatic.claim(address);
  }

  getRewardTokenAddress(contract: AladdinConcentratorVeRewards): Promise<string> {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: AladdinConcentratorVe): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }
}
