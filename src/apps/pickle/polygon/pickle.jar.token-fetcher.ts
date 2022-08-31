import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.jar.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonPickleJarTokenFetcher extends PickleJarTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Jars';
}
