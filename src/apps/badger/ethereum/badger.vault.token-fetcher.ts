import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BadgerVaultTokenFetcher } from '../common/badger.vault.token-fetcher';

@PositionTemplate()
export class EthereumBadgerVaultTokenFetcher extends BadgerVaultTokenFetcher {
  groupLabel = 'Vaults';
}
