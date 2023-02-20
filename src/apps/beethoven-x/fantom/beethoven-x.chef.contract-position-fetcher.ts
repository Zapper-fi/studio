import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXChefContractPositionFetcher } from '../common/beethoven-x.chef.contract-position-fetcher';

@PositionTemplate()
export class FantomBeethovenXChefContractPositionFetcher extends BeethovenXChefContractPositionFetcher {
  groupLabel = 'Chef Farms';
  chefAddress = '0x8166994d9ebbe5829ec86bd81258149b87facfd3';
}
