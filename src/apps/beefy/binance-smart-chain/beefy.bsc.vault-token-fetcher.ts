import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokenFetcher } from '../common/beefy.vault-token-fetcher';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainBeefyVaultTokenFetcher extends BeefyVaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';
}
