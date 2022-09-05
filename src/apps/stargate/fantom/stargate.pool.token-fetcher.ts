import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class FantomStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0x9d1b1669c73b033dfe47ae5a0164ab96df25b944';
  useLocalDecimals = false;
}
