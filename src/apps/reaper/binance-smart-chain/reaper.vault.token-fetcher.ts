import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ReaperVaultTokenFetcher } from '../common/reaper.vault.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainReaperVaultTokenFetcher extends ReaperVaultTokenFetcher {
  groupLabel = 'Vaults';
}
