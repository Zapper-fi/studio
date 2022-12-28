import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { AngleApiHelper } from '../common/angle.api';
import { AngleContractFactory, AngleVeAngle, AngleLiquidityGauge } from '../contracts';

@PositionTemplate()
export class EthereumAngleVeAngleContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  AngleVeAngle,
  AngleLiquidityGauge
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x0c462dbb9ec8cd1630f1728b2cfd2769d09f0dd5';
  rewardAddress = '0x51fe22abaf4a26631b2913e417c0560d547797a7';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) protected readonly contractFactory: AngleContractFactory,
    @Inject(AngleApiHelper) protected readonly angleApiHelper: AngleApiHelper,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): AngleVeAngle {
    return this.contractFactory.angleVeAngle({ address, network: this.network });
  }

  getRewardContract(address: string): AngleLiquidityGauge {
    return this.contractFactory.angleLiquidityGauge({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: AngleVeAngle): Promise<string> {
    return contract.token();
  }

  async getRewardTokenAddress(contract: AngleLiquidityGauge): Promise<string> {
    return contract.staking_token();
  }

  async getEscrowedTokenBalance(address: string, contract: AngleVeAngle): Promise<BigNumberish> {
    return contract.locked(address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, _contract: AngleLiquidityGauge): Promise<BigNumberish> {
    const { rewardsData } = await this.angleApiHelper.getRewardsData(address, this.network);
    return rewardsData.totalClaimable;
  }
}
