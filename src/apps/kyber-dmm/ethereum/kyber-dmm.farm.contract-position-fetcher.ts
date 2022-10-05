import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumKyberDmmFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x31de05f28568e3d3d612bfa6a78b356676367470';
}
