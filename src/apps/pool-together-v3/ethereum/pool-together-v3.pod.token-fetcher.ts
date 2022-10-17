import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3PodTokenFetcher } from '../common/pool-together-v3.pod.token-fetcher';

@PositionTemplate()
export class EthereumPoolTogetherV3PodTokenFetcher extends PoolTogetherV3PodTokenFetcher {
  groupLabel = 'Prize Pods';
  isExcludedFromExplore = true;
  registryAddress = '0x4658f736b93dcddcbce46cde955970e697fd351f';
}
