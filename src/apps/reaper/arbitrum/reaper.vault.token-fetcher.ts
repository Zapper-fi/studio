import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ReaperVaultTokenFetcher } from '../common/reaper.vault.token-fetcher';

@PositionTemplate()
export class ArbitrumReaperVaultTokenFetcher extends ReaperVaultTokenFetcher {
  groupLabel = 'Vaults';
}
