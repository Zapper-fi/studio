import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberDmmFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x829c27fd3013b944cbe76e92c3d6c45767c0c789', '0x3add3034fcf921f20c74c6149fb44921709595b1'];
}
