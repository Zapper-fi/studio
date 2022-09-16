import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BadgerVaultTokenFetcher } from '../common/badger.vault.token-fetcher';

@PositionTemplate()
export class PolygonBadgerVaultTokenFetcher extends BadgerVaultTokenFetcher {
  groupLabel = 'Vaults';
}
