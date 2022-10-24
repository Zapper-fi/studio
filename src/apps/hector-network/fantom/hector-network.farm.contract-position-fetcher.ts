import { Inject } from '@nestjs/common';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { HectorNetworkContractFactory } from '../contracts';
import { HectorNetworkStakingRewards } from '../contracts/ethers/HectorNetworkStakingRewards';

// NOTE: Hector Network also has two other pools staked in the SpookySwap MasterChef
const FARMS = [
  {
    address: '0x61b71689684800f73ebb67378fc2e1527fbdc3b3',
    stakedTokenAddress: '0x24699312cb27c26cfc669459d670559e5e44ee60',
    rewardTokenAddresses: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'],
  },
];

@PositionTemplate()
export class FantomHectorNetworkFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<HectorNetworkStakingRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HectorNetworkStakingRewards {
    return this.contractFactory.hectorNetworkStakingRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<HectorNetworkStakingRewards>) {
    return contract.rewardRate();
  }

  async getActivePeriod({ contract }: GetDataPropsParams<HectorNetworkStakingRewards>): Promise<boolean> {
    const periodFinishRaw = await contract.periodFinish();
    const epochNow = moment().unix();
    const periodFinish = Number(periodFinishRaw);

    return epochNow < periodFinish ? true : false;
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<HectorNetworkStakingRewards>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<HectorNetworkStakingRewards>) {
    return contract.earned(address);
  }
}
