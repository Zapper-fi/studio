import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapDmmFarmContractPositionFetcher } from '../common/kyberswap-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberSwapDmmFarmContractPositionFetcher extends KyberSwapDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x3add3034fcf921f20c74c6149fb44921709595b1';
}
