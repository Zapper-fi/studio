import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { RoboVaultVaultTokenFetcher } from '../common/robo-vault.vault.token-fetcher';
import ROBO_VAULT_DEFINITION from '../robo-vault.definition';

const appId = ROBO_VAULT_DEFINITION.id;
const groupId = ROBO_VAULT_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomRoboVaultVaultTokenFetcher extends RoboVaultVaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';
}
