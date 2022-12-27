import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';

@PositionTemplate()
export class CeloCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  groupLabel = 'Vaults';
  caskVaultContractAddress = '0xbccdbb0806acc914f6746de592f924b374190710';
}
