import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';

@PositionTemplate()
export class FantomStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x224d8fd7ab6ad4c6eb4611ce56ef35dec2277f03'];
}
