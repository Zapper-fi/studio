import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { ConcentratorContractFactory, AladdinConcentratorVe, AladdinConcentratorVeRewards } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorVeContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  AladdinConcentratorVe,
  AladdinConcentratorVeRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xe4C09928d834cd58D233CD77B5af3545484B4968'.toLowerCase();
  rewardAddress = '0xA5D9358c60fC9Bd2b508eDa17c78C67A43A4458C'.toLowerCase();;

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
    return contract.callStatic.claim(address)
  }

  getRewardTokenAddress(contract: AladdinConcentratorVeRewards): Promise<string> {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: AladdinConcentratorVe): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }
}
