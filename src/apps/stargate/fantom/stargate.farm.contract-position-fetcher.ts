import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetMasterChefDataPropsParams } from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChef } from '../contracts';

@PositionTemplate()
export class FantomStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChef> {
  groupLabel = 'Farms';
  chefAddress = '0x224d8fd7ab6ad4c6eb4611ce56ef35dec2277f03';

  getStargateChefContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChef): Promise<string> {
    return contract.stargate();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.stargatePerBlock();
  }
}
