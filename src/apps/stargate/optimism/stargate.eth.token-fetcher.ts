import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class OptimismStargateEthTokenFetcher extends StargateEthTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.eth.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Wrapped';

  stargateEthAddress = '0xd22363e3762ca7339569f3d33eade20127d5f98c';
}
