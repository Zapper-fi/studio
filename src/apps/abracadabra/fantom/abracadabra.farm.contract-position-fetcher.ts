import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@PositionTemplate()
export class FantomAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x37cf490255082ee50845ea4ff783eb9b6d1622ce'];
}
