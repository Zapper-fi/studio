import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { LyraAvalonViemContractFactory } from '../contracts';
import { LyraLpStaking } from '../contracts/viem';

const FARMS = [
  {
    address: '0x1a364a7e66b21ed3045b13d3465627f9e9613f07',
    stakedTokenAddress: '0xe6f375a29cdd3b40fa7aa0932ff510d304d95fa6', // Lyra/WETH Arrakis vault token
    rewardTokenAddresses: ['0x01ba67aac7f75f647d94220cc98fb30fcc5105bf'], // Lyra
  },
];

@PositionTemplate()
export class EthereumLyraAvalonStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<LyraLpStaking> {
  groupLabel = 'Farm';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonViemContractFactory) protected readonly contractFactory: LyraAvalonViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lyraLpStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<LyraLpStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<LyraLpStaking>) {
    return (await contract.read.rewardRate()) > 0;
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<LyraLpStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<LyraLpStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
