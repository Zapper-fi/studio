import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetMasterChefDataPropsParams } from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChef } from '../contracts';

@PositionTemplate()
export class OptimismStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChef> {
  groupLabel = 'Farms';
  chefAddress = '0x4a364f8c717caad9a442737eb7b8a55cc6cf18d8';

  getStargateChefContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChef): Promise<string> {
    return contract.read.stargate();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.read.stargatePerBlock();
  }
}
