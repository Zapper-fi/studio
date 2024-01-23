import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { LiquityViemContractFactory } from '../contracts';
import { LiquityStaking } from '../contracts/viem';

const FARMS = [
  {
    address: '0x4f9fbb3f1e99b56e0fe2892e623ed36a76fc605d',
    stakedTokenAddress: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    rewardTokenAddresses: ['0x5f98805a4e8be255a32880fdec7f6728c6568ba0', ZERO_ADDRESS], // LUSD and ETH
  },
];

@PositionTemplate()
export class EthereumLiquityStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<LiquityStaking> {
  groupLabel = 'Staked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LiquityViemContractFactory) protected readonly contractFactory: LiquityViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.liquityStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates() {
    return [0, 0];
  }

  async getIsActive() {
    return true;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<LiquityStaking>) {
    return contract.read.stakes([address]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<LiquityStaking>) {
    return Promise.all([contract.read.getPendingLUSDGain([address]), contract.read.getPendingETHGain([address])]);
  }
}
