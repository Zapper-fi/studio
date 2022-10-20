import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';
import { HOMORA_V_2_DEFINITION } from '../homora-v2.definition';

@PositionTemplate()
export class OptimismHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  appId = HOMORA_V_2_DEFINITION.id;
  groupId = HOMORA_V_2_DEFINITION.groups.farm.id;
  network = Network.OPTIMISM_MAINNET;
  homoraBankAddress = '0xffa51a5ec855f8e38dd867ba503c454d8bbc5ab9';

  groupLabel = 'Farms';
}
