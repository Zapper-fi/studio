import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmContractPositionFetcher } from '../common/kyberswap-classic.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x3add3034fcf921f20c74c6149fb44921709595b1';
}
