import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChef } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChef> {
  groupLabel = 'Farms';
  chefAddress = '0x3052a0f6ab15b4ae1df39962d5ddefaca86dab47';

  getStargateChefContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChef): Promise<string> {
    return contract.stargate();
  }
}
