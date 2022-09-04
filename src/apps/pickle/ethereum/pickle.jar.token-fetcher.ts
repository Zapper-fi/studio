import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Injectable()
export class EthereumPickleJarTokenFetcher extends PickleJarTokenFetcher {
  appId = PICKLE_DEFINITION.id;
  groupId = PICKLE_DEFINITION.groups.jar.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Jars';
}
