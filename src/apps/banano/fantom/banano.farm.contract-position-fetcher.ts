import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BananoFarmContractPositionFetcher } from '../common/banano.farm.contract-position-fetcher';

@PositionTemplate()
export class FantomBananoFarmContractPositionFetcher extends BananoFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0xd91f84d4e2d9f4fa508c61356a6cb81a306e5287';
}
