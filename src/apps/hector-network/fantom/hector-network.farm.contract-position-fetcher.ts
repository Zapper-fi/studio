import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { HectorNetworkViemContractFactory } from '../contracts';
import { HectorNetworkStakingRewards } from '../contracts/viem/HectorNetworkStakingRewards';

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
    @Inject(HectorNetworkViemContractFactory) protected readonly contractFactory: HectorNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkStakingRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<HectorNetworkStakingRewards>) {
    return contract.read.rewardRate();
  }

  getIsActive({
    contract,
  }: GetDataPropsParams<HectorNetworkStakingRewards, SingleStakingFarmDefinition>): Promise<boolean> {
    return contract.read.rewardRate().then(v => v > 0);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<HectorNetworkStakingRewards>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<HectorNetworkStakingRewards>) {
    return contract.read.earned([address]);
  }
}
