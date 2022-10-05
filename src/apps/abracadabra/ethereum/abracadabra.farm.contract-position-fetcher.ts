import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0xf43480afe9863da4acbd4419a47d9cc7d25a647f'];
}
