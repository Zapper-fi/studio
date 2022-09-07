import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { EaseRcaTokenFetcher } from '../common/ease.rca.token-fetcher';
import EASE_DEFINITION from '../ease.definition';

@Injectable()
export class EthereumEaseRcaTokenFetcher extends EaseRcaTokenFetcher {
  appId = EASE_DEFINITION.id;
  groupId = EASE_DEFINITION.groups.rca.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'RCAs';
}
