import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UnipilotVaultTokenFetcher } from '../common/unipilot.vault.token-fetcher';

@PositionTemplate()
export class EthereumUnipilotPoolTokenFetcher extends UnipilotVaultTokenFetcher {
  groupLabel = 'Vaults';
}
