import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.farm.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0x3052a0f6ab15b4ae1df39962d5ddefaca86dab47';
}
