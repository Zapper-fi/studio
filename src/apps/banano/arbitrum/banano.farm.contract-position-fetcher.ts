import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BananoFarmContractPositionFetcher } from '../common/banano.farm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumBananoFarmContractPositionFetcher extends BananoFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x8cd4ded2b49736b1a1dbe18b9eb4ba6b6bf28227';
}
