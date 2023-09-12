import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { MstableContractFactory, MstableVmta } from '../contracts';

const MTA_V1_FARMS = [
  // MTA staking v1
  {
    address: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    stakedTokenAddress: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'],
  },
];

@PositionTemplate()
export class EthereumMstableMtaV1FarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MstableVmta> {
  groupLabel = 'MTA Staking V1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) protected readonly contractFactory: MstableContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MstableVmta {
    return this.contractFactory.mstableVmta({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return MTA_V1_FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<MstableVmta, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<MstableVmta>) {
    return (await contract.rewardRate()).gt(0);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<MstableVmta, SingleStakingFarmDataProps>) {
    return contract
      .locked(address)
      .then(v => v.amount)
      .catch(() => BigNumber.from('0'));
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<MstableVmta, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
