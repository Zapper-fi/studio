import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberDmmFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x3add3034fcf921f20c74c6149fb44921709595b1';
}
