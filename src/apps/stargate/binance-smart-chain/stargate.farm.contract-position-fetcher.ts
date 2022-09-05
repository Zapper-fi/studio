import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class BinanceSmartChainStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.farm.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x3052a0f6ab15b4ae1df39962d5ddefaca86dab47';
}
