import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { AelinContractFactory, AelinStaking } from '../contracts';

const FARMS = [
  {
    address: '0xfe757a40f3eda520845b339c698b321663986a4d',
    stakedTokenAddress: '0x61baadcf22d2565b0f471b291c475db5555e0b76',
    rewardTokenAddresses: ['0x61baadcf22d2565b0f471b291c475db5555e0b76'],
  },
  {
    address: '0x4aec980a0daef4905520a11b99971c7b9583f4f8',
    stakedTokenAddress: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
    rewardTokenAddresses: ['0x61baadcf22d2565b0f471b291c475db5555e0b76'],
  },
];

@PositionTemplate()
export class OptimismAelinFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<AelinStaking> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory) protected readonly contractFactory: AelinContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AelinStaking {
    return this.contractFactory.aelinStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<AelinStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getIsActive({
    contract,
  }: GetDataPropsParams<AelinStaking, SingleStakingFarmDataProps, SingleStakingFarmDefinition>): Promise<boolean> {
    return contract.rewardRate().then(v => v.gt(0));
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<AelinStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<AelinStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
