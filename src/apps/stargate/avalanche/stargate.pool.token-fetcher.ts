import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  factoryAddress = '0x808d7c71ad2ba3fa531b068a2417c63106bc0949';
  useLocalDecimals = false;
}
