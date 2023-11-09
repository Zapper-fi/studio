import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
    address: '0xb02e538a08cfa00e9900cf94e33b161323d8d162',
    stakedTokenAddress: '0x70535c46ce04181adf749f34b65b6365164d6b6e',
    rewardTokenAddresses: ['0x50c5725949a6f0c72e6c4a641f24049a917db0cb'],
  },
];

@PositionTemplate()
export class OptimismLyraAvalonStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<LyraLpStaking> {
  groupLabel = 'Farms';

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

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<LyraLpStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<LyraLpStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
