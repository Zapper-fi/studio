import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { KyberDmmFarmContractPositionFetcher } from '../common/kyber-dmm.farm.contract-position-fetcher';
import { KYBER_DMM_DEFINITION } from '../kyber-dmm.definition';

@PositionTemplate()
export class EthereumKyberDmmFarmContractPositionFetcher extends KyberDmmFarmContractPositionFetcher {
  network = Network.ETHEREUM_MAINNET;
  groupId = KYBER_DMM_DEFINITION.groups.farm.id;
  appId = KYBER_DMM_DEFINITION.id;
  groupLabel = 'Farms';

  chefAddresses = ['0x31de05f28568e3d3d612bfa6a78b356676367470'];
}
