import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YearnV2VaultTokenFetcher } from '../common/yearn.v2-vault.token-fetcher';

@PositionTemplate()
export class ArbitrumYearnV2VaultTokenFetcher extends YearnV2VaultTokenFetcher {
  groupLabel = 'Vaults';
  vaultsToIgnore = [];
}
