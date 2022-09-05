import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class BinanceSmartChainStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Pool';
  factoryAddress = '0xe7ec689f432f29383f217e36e680b5c855051f25';
  useLocalDecimals = true;
}
