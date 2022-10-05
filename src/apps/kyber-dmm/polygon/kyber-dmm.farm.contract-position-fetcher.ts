import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';
import { KYBER_DMM_DEFINITION } from '../kyber-dmm.definition';

@PositionTemplate()
export class PolygonKyberDmmFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  network = Network.POLYGON_MAINNET;
  groupId = KYBER_DMM_DEFINITION.groups.farm.id;
  appId = KYBER_DMM_DEFINITION.id;
  groupLabel = 'Farms';

  chefAddresses = ['0x829c27fd3013b944cbe76e92c3d6c45767c0c789', '0x3add3034fcf921f20c74c6149fb44921709595b1'];
}
