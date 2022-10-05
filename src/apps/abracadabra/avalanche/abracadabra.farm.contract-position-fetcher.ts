import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x06408571e0ad5e8f52ead01450bde74e5074dc74';
}
