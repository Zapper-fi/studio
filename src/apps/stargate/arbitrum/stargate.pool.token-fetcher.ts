import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class ArbitrumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0x55bdb4164d28fbaf0898e0ef14a589ac09ac9970';
  useLocalDecimals = false;
}
