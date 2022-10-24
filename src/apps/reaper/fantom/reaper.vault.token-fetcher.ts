import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { ReaperVaultTokenFetcher } from '../common/reaper.vault.token-fetcher';
import { REAPER_DEFINITION } from '../reaper.definition';

@PositionTemplate()
export class FantomReaperVaultTokenFetcher extends ReaperVaultTokenFetcher {
  appId = REAPER_DEFINITION.id;
  groupId = REAPER_DEFINITION.groups.vault.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Vaults';
}
