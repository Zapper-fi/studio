import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';

@PositionTemplate()
export class ArbitrumCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  groupLabel = 'Vaults';
  caskVaultContractAddress = '0x20151ff7fdd720b85063d02081aa5b7876adff7b';
}
