import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { RoboVaultVaultTokenFetcher } from '../common/robo-vault.vault.token-fetcher';
import ROBO_VAULT_DEFINITION from '../robo-vault.definition';

@Injectable()
export class AvalancheRoboVaultVaultTokenFetcher extends RoboVaultVaultTokenFetcher {
  appId = ROBO_VAULT_DEFINITION.id;
  groupId = ROBO_VAULT_DEFINITION.groups.vault.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Vaults';
}
