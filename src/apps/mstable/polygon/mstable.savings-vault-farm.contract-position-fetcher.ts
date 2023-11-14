import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { MstableViemContractFactory } from '../contracts';
import { MstableStaking } from '../contracts/viem';

const SAVINGS_VAULTS = [
  {
    address: '0x32aba856dc5ffd5a56bcd182b13380e5c855aa29',
    stakedTokenAddress: '0x5290ad3d83476ca6a2b178cd9727ee1ef72432af', // imUSD
    rewardTokenAddresses: ['0xf501dd45a1198c2e1b5aef5314a68b9006d842e0'], // MTA
  },
];

@PositionTemplate()
export class PolygonMstableSavingsVaultContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MstableStaking> {
  groupLabel = 'Savings Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableViemContractFactory) protected readonly contractFactory: MstableViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mstableStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return SAVINGS_VAULTS;
  }

  getRewardRates({ contract }: GetDataPropsParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  getIsActive({ contract }: GetDataPropsParams<MstableStaking>) {
    return contract.read.rewardRate().then(rate => rate > 0);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
