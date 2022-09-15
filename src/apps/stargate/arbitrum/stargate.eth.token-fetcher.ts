import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class ArbitrumStargateEthTokenFetcher extends StargateEthTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.eth.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Wrapped';

  stargateEthAddress = '0x915a55e36a01285a14f05de6e81ed9ce89772f8e';
}
