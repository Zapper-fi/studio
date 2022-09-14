import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class OptimismStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0xe3b53af74a4bf62ae5511055290838050bf764df';
  useLocalDecimals = false;
}
