import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { AnglePositionResolver } from '../common/angle.position-resolver';
import { AngleViemContractFactory } from '../contracts';
import { AngleVeAngle, AngleLiquidityGauge } from '../contracts/viem';
import { AngleLiquidityGaugeContract } from '../contracts/viem/AngleLiquidityGauge';
import { AngleVeAngleContract } from '../contracts/viem/AngleVeAngle';

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
    @Inject(AngleViemContractFactory) protected readonly contractFactory: AngleViemContractFactory,
    @Inject(AnglePositionResolver) protected readonly anglePositionResolver: AnglePositionResolver,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string) {
    return this.contractFactory.angleVeAngle({ address, network: this.network });
  }

  getRewardContract(address: string) {
    return this.contractFactory.angleLiquidityGauge({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: AngleVeAngleContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenAddress(contract: AngleLiquidityGaugeContract): Promise<string> {
    return contract.read.staking_token();
  }

  async getEscrowedTokenBalance(address: string, contract: AngleVeAngleContract): Promise<BigNumberish> {
    return contract.read.locked([address]).then(v => v[0]);
  }

  async getRewardTokenBalance(address: string, _contract: AngleLiquidityGaugeContract): Promise<BigNumberish> {
    const { rewardsData } = await this.anglePositionResolver.getRewardsData(address, this.network);
    return rewardsData.totalClaimable;
  }
}
