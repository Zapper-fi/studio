import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { RariViemContractFactory } from '../contracts';
import { RariUniswapTokenDistributor } from '../contracts/viem';

const FARMS = [
  // SLP ETH/RGT
  {
    address: '0x1fa69a416bcf8572577d3949b742fbb0a9cd98c7',
    stakedTokenAddress: '0x18a797c7c70c1bf22fdee1c09062aba709cacf04',
    rewardTokenAddresses: ['0xd291e7a03283640fdc51b121ac401383a46cc623'],
  },
];

@PositionTemplate()
export class EthereumRariFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<RariUniswapTokenDistributor> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariViemContractFactory) protected readonly contractFactory: RariViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.rariUniswapTokenDistributor({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates(_params: GetDataPropsParams<RariUniswapTokenDistributor>) {
    return [0];
  }

  async getIsActive() {
    return true;
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<RariUniswapTokenDistributor>) {
    return contract.read.stakingBalances([address]);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<RariUniswapTokenDistributor>) {
    return contract.read.getUnclaimedRgt([address]);
  }
}
