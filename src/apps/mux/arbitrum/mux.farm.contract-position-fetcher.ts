import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { MuxViemContractFactory } from '../contracts';
import { MuxRewardTracker } from '../contracts/viem';

const MLP_FARM = {
  address: '0x290450cdea757c68e4fe6032ff3886d204292914',
  stakedTokenAddress: '0x7cbaf5a14d953ff896e5b3312031515c858737c8',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

const MCB_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

const MUX_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

@PositionTemplate()
export class ArbitrumMuxFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MuxRewardTracker> {
  groupLabel = 'Farms';
  farms = [MLP_FARM, MCB_FARM, MUX_FARM];
  readerAddress = '0x437cea956b415e97517020490205c07f4a845168';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.muxRewardTracker({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return this.farms;
  }

  async getRewardRates() {
    return [0, 0];
  }

  async getIsActive() {
    return true;
  }

  async getStakedTokenBalance() {
    return 0;
  }

  async getRewardTokenBalances() {
    return 0;
  }
}
