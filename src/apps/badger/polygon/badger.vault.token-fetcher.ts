import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerVaultTokenFetcher } from '../helpers/badger.vault.token-fetcher';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.vault.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonBadgerVaultTokenFetcher extends BadgerVaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Vaults';
}
