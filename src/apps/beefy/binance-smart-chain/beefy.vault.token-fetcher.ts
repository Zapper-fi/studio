import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeefyVaultTokenFetcher } from '../common/beefy.vault.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainBeefyVaultTokenFetcher extends BeefyVaultTokenFetcher {
  groupLabel = 'Vaults';
}
