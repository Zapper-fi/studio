import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PendleYieldTokenFetcher } from '../common/pendle.yield.token-fetcher';
import { PENDLE_DEFINITION } from '../pendle.definition';

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.yield.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePendleYieldTokenFetcher extends PendleYieldTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Future Yield';
  pendleDataAddress = '0x94d7e5c48ca9627001facb04d1820c54dff3032c';
}
