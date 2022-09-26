import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x839de324a1ab773f76a53900d70ac1b913d2b387';
}
