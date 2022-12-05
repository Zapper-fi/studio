import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';
import { HOMORA_V_2_DEFINITION } from '../homora-v2.definition';

@PositionTemplate()
export class FantomHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  appId = HOMORA_V_2_DEFINITION.id;
  groupId = HOMORA_V_2_DEFINITION.groups.farm.id;
  network = Network.FANTOM_OPERA_MAINNET;
  homoraBankAddress = '0x060e91a44f16dfcc1e2c427a0383596e1d2e886f';

  groupLabel = 'Farms';
}
