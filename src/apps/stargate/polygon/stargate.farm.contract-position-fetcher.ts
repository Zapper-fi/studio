import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChef } from '../contracts';

@PositionTemplate()
export class PolygonStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChef> {
  groupLabel = 'Farms';
  chefAddress = '0x8731d54e9d02c286767d56ac03e8037c07e01e98';

  getStargateChefContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }
  getStargateTokenAddress(contract: StargateChef): Promise<string> {
    return contract.stargate();
  }
}
