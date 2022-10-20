import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { HomoraV2LendingTokenFetcher } from '../common/homora-v2.lending.token-position-fetcher';
import { HOMORA_V_2_DEFINITION } from '../homora-v2.definition';

@PositionTemplate()
export class FantomHomoraV2LendingTokenFetcher extends HomoraV2LendingTokenFetcher {
  appId = HOMORA_V_2_DEFINITION.id;
  groupId = HOMORA_V_2_DEFINITION.groups.lending.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
}
