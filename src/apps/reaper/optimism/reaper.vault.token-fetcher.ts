import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ReaperVaultTokenFetcher } from '../common/reaper.vault.token-fetcher';

@PositionTemplate()
export class OptimismReaperVaultTokenFetcher extends ReaperVaultTokenFetcher {
  groupLabel = 'Vaults';

  VaultAddressesNotCompatibleErc20 = ['0x85a21d07a3deefe58ecd841198d7f774e6444654'];
}
