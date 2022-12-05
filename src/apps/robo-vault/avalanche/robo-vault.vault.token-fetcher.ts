import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RoboVaultVaultTokenFetcher } from '../common/robo-vault.vault.token-fetcher';

@PositionTemplate()
export class AvalancheRoboVaultVaultTokenFetcher extends RoboVaultVaultTokenFetcher {
  groupLabel = 'Vaults';
}
