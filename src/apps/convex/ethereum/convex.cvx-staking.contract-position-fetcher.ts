import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { ConvexContractFactory, ConvexCvxStaking } from '../contracts';

const FARMS = [
  {
    address: '0xcf50b810e57ac33b91dcf525c6ddd9881b139332',
    stakedTokenAddress: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', // CVX
    rewardTokenAddresses: ['0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7'], // cvxCRV
  },
];

@PositionTemplate()
export class EthereumConvexCvxStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<ConvexCvxStaking> {
  groupLabel = 'CVX Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexCvxStaking {
    return this.contractFactory.convexCvxStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  async getActivePeriod({ contract }: GetDataPropsParams<ConvexCvxStaking>): Promise<boolean> {
    const periodFinishRaw = await contract.periodFinish();
    const epochNow = moment().unix();
    const periodFinish = Number(periodFinishRaw);

    return epochNow < periodFinish ? true : false;
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
