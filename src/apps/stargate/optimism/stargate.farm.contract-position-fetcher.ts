import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';

@PositionTemplate()
export class OptimismStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x4a364f8c717caad9a442737eb7b8a55cc6cf18d8'];
}
