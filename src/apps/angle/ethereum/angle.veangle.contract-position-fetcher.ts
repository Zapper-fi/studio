import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleApiHelper } from '../common/angle.api';
import { AngleContractFactory, AngleVeangle, AngleLiquidityGauge } from '../contracts';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.veangle.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVeAngleContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  AngleVeangle,
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

  getEscrowContract(address: string): AngleVeangle {
    return this.contractFactory.angleVeangle({ address, network: this.network });
  }

  getRewardContract(address: string): AngleLiquidityGauge {
    return this.contractFactory.angleLiquidityGauge({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: AngleVeangle): Promise<string> {
    return contract.token();
  }

  async getRewardTokenAddress(contract: AngleLiquidityGauge): Promise<string> {
    return contract.staking_token();
  }

  async getEscrowedTokenBalance(address: string, contract: AngleVeangle): Promise<BigNumberish> {
    return contract.locked(address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, _contract: AngleLiquidityGauge): Promise<BigNumberish> {
    const { rewardsData } = await this.angleApiHelper.getRewardsData(address, network);
    return rewardsData.totalClaimable;
  }
}
