import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';
import { HOMORA_V_2_DEFINITION } from '../homora-v2.definition';

@PositionTemplate()
export class AvalancheHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  appId = HOMORA_V_2_DEFINITION.id;
  groupId = HOMORA_V_2_DEFINITION.groups.farm.id;
  network = Network.AVALANCHE_MAINNET;
  homoraBankAddress = '0x376d16c7de138b01455a51da79ad65806e9cd694';

  groupLabel = 'Farms';
}
