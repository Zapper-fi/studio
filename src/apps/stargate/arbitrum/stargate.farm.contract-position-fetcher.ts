import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0xea8dfee1898a7e0a59f7527f076106d7e44c2176';
}
