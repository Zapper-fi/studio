import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeefyVaultTokenFetcher } from '../common/beefy.vault-token-fetcher';

@PositionTemplate()
export class AvalancheBeefyVaultTokenFetcher extends BeefyVaultTokenFetcher {
  groupLabel = 'Vaults';
}
