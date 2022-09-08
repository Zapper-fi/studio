import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class EthereumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0x06d538690af257da524f25d0cd52fd85b1c2173e';
  useLocalDecimals = false;
}
