import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { RariViemContractFactory } from '../contracts';
import { RariGovernanceTokenDistributor } from '../contracts/viem';

const FARMS = [
  // RGT
  {
    address: '0x9c0caeb986c003417d21a7daaf30221d61fc1043',
    stakedTokenAddress: '0xd291e7a03283640fdc51b121ac401383a46cc623',
    rewardTokenAddresses: ['0xd291e7a03283640fdc51b121ac401383a46cc623'],
  },
];

@PositionTemplate()
export class EthereumRariGovernanceContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<RariGovernanceTokenDistributor> {
  groupLabel = 'Governance';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariViemContractFactory) protected readonly contractFactory: RariViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.rariGovernanceTokenDistributor({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates(_params: GetDataPropsParams<RariGovernanceTokenDistributor>) {
    return [0];
  }

  async getIsActive() {
    return true;
  }

  async getStakedTokenBalance(_params: GetTokenBalancesParams<RariGovernanceTokenDistributor>) {
    return [0];
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<RariGovernanceTokenDistributor>) {
    return contract.getUnclaimedRgt(address);
  }
}
