import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChefBase } from '../contracts';

@PositionTemplate()
export class BaseStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChefBase> {
  groupLabel = 'Farms';
  chefAddress = '0x06eb48763f117c7be887296cdcdfad2e4092739c';

  getStargateChefContract(address: string): StargateChefBase {
    return this.contractFactory.stargateChefBase({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChefBase): Promise<string> {
    return contract.eToken();
  }
}
