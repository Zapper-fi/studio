import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class EthereumStargateEthTokenFetcher extends StargateEthTokenFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.eth.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Wrapped';

  stargateEthAddress = '0x72e2f4830b9e45d52f80ac08cb2bec0fef72ed9c';
}
