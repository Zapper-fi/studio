import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetMasterChefDataPropsParams } from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChef } from '../contracts/viem';
import { StargateChefContract } from '../contracts/viem/StargateChef';

@PositionTemplate()
export class ArbitrumStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0xea8dfee1898a7e0a59f7527f076106d7e44c2176';

  getStargateChefContract(address: string) {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChefContract): Promise<string> {
    return contract.read.stargate();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.read.stargatePerBlock();
  }
}
