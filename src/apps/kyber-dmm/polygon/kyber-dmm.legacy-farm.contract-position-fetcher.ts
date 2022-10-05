import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberDmmLegacyFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x829c27fd3013b944cbe76e92c3d6c45767c0c789';
}
