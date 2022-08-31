import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pool';
  factoryAddress = '0x55bdb4164d28fbaf0898e0ef14a589ac09ac9970';
  useLocalDecimals = false;
}
