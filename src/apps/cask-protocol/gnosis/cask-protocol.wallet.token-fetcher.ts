import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';

@PositionTemplate()
export class GnosisCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  caskVaultContractAddress = '0x3b2b4b547daeebf3a703288cb43650f0f287b9ff';
  groupLabel = 'Vaults';
}
