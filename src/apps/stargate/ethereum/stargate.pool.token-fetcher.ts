import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  factoryAddress = '0x06d538690af257da524f25d0cd52fd85b1c2173e';
  useLocalDecimals = false;
}
