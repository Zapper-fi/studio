import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PendleOwnershipTokenFetcher } from '../common/pendle.ownership.token-fetcher';
import { PENDLE_DEFINITION } from '../pendle.definition';

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.ownership.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePendleOwnershipTokenFetcher extends PendleOwnershipTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Ownership';
  pendleDataAddress = '0x94d7e5c48ca9627001facb04d1820c54dff3032c';
  dexFactoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
}
