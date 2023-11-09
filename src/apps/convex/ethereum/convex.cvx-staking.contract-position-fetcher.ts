import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { ConvexViemContractFactory } from '../contracts';
import { ConvexCvxStaking } from '../contracts/viem';

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
    @Inject(ConvexViemContractFactory) protected readonly contractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.convexCvxStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  getIsActive({
    contract,
  }: GetDataPropsParams<ConvexCvxStaking, SingleStakingFarmDataProps, SingleStakingFarmDefinition>): Promise<boolean> {
    return contract.read.rewardRate().then(v => v > 0);
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<ConvexCvxStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
