import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0x8731d54e9d02c286767d56ac03e8037c07e01e98';
}
