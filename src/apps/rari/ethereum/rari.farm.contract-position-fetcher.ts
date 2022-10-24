import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { RariContractFactory, RariUniswapTokenDistributor } from '../contracts';

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
    @Inject(RariContractFactory) protected readonly contractFactory: RariContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RariUniswapTokenDistributor {
    return this.contractFactory.rariUniswapTokenDistributor({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates(_params: GetDataPropsParams<RariUniswapTokenDistributor>) {
    return [0];
  }

  async getActivePeriod({ contract }: GetDataPropsParams<RariUniswapTokenDistributor>): Promise<boolean> {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const currentBlockNumber = await provider.getBlockNumber();
    const distributionEndBlockRaw = await contract.distributionEndBlock();
    const distributionEndBlock = Number(distributionEndBlockRaw);

    return distributionEndBlock > currentBlockNumber ? true : false;
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<RariUniswapTokenDistributor>) {
    return contract.stakingBalances(address);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<RariUniswapTokenDistributor>) {
    return contract.getUnclaimedRgt(address);
  }
}
