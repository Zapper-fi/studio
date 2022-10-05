import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0xb0d502e938ed5f4df2e681fe6e419ff29631d62b'];
}
