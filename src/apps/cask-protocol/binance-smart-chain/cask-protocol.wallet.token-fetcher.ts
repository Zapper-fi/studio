import { Register } from '~app-toolkit/decorators';
import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';
import { Network } from '~types/network.interface';

import { CASK_PROTOCOL_DEFINITION } from '../cask-protocol.definition';

const appId = CASK_PROTOCOL_DEFINITION.id;
const groupId = CASK_PROTOCOL_DEFINITION.groups.wallet.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BNBChainCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  caskVaultContractAddress = '0x3b2b4b547dAEEbf3A703288CB43650f0F287b9ff';
  caskNetwork = Network.BINANCE_SMART_CHAIN_MAINNET;
}
