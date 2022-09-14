import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3PodTokenFetcher } from '../common/pool-together-v3.pod.token-fetcher';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

@Injectable()
export class EthereumPoolTogetherV3PodTokenFetcher extends PoolTogetherV3PodTokenFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.pod.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Prize Pods';
  isExcludedFromExplore = true;
  registryAddress = '0x4658f736b93dcddcbce46cde955970e697fd351f';
}
