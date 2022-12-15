import { Register } from '~app-toolkit/decorators';
import { CaskProtocolWalletTokenFetcher } from '../common/cask-protocol.wallet.token-fetcher';
import { Network } from '~types/network.interface';

import { CASK_PROTOCOL_DEFINITION } from '../cask-protocol.definition';

const appId = CASK_PROTOCOL_DEFINITION.id;
const groupId = CASK_PROTOCOL_DEFINITION.groups.wallet.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomCaskProtocolWalletTokenFetcher extends CaskProtocolWalletTokenFetcher {
  caskVaultContractAddress = '0xBCcDbB0806Acc914F6746DE592f924B374190710';
  caskNetwork = Network.FANTOM_OPERA_MAINNET;
}
