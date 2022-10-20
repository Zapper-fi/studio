import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';
import { HOMORA_V_2_DEFINITION } from '../homora-v2.definition';

@PositionTemplate()
export class EthereumHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  appId = HOMORA_V_2_DEFINITION.id;
  groupId = HOMORA_V_2_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  homoraBankAddress = '0xba5ebaf3fc1fcca67147050bf80462393814e54b';

  groupLabel = 'Farms';
}
