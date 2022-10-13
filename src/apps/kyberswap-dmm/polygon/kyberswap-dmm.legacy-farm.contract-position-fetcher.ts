import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapDmmFarmContractPositionFetcher } from '../common/kyberswap-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberSwapDmmLegacyFarmContractPositionFetcher extends KyberSwapDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x829c27fd3013b944cbe76e92c3d6c45767c0c789';
}
