import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokenFetcher } from '../helpers/beefy.vault-token-fetcher';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomBeefyVaultTokenFetcher extends BeefyVaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';
}
