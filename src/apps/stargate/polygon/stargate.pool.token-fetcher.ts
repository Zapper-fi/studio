import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class PolygonStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0x808d7c71ad2ba3fa531b068a2417c63106bc0949';
  useLocalDecimals = false;
}
