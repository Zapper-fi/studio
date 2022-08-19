import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  factoryAddress = '0xe3b53af74a4bf62ae5511055290838050bf764df';
  useLocalDecimals = false;
}
