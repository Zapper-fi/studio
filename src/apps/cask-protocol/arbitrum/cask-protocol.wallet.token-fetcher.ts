import { Register } from '~app-toolkit/decorators';
import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';
import { Network } from '~types/network.interface';

import { CASK_PROTOCOL_DEFINITION } from '../cask-protocol.definition';

const appId = CASK_PROTOCOL_DEFINITION.id;
const groupId = CASK_PROTOCOL_DEFINITION.groups.wallet.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  caskVaultContractAddress = '0x20151ff7fdd720b85063d02081aa5b7876adff7b';
  caskNetwork = Network.ARBITRUM_MAINNET;
}
