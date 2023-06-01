import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YearnVaultTokenFetcher } from '../common/yearn.vault.token-fetcher';

@PositionTemplate()
export class OptimismYearnVaultTokenFetcher extends YearnVaultTokenFetcher {
  groupLabel = 'Vault';
}
