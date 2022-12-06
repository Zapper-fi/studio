import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { MstableContractFactory, MstableStaking } from '../contracts';

const MTA_V1_FARMS = [
  // MTA staking v1
  {
    address: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    stakedTokenAddress: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'],
  },
];

@PositionTemplate()
export class EthereumMstableMtaV1FarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MstableStaking> {
  groupLabel = 'MTA Staking V1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) protected readonly contractFactory: MstableContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MstableStaking {
    return this.contractFactory.mstableStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return MTA_V1_FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
