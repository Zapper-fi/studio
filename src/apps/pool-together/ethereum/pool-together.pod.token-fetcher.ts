import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherPodTokenHelper } from '../helpers/pool-together.pod.token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.pod.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPoolTogetherPodTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherPodTokenHelper)
    private readonly poolTogetherPodTokenHelper: PoolTogetherPodTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherPodTokenHelper.getTokens({
      network,
      registryAddress: '0x4658f736b93dcddcbce46cde955970e697fd351f',
    });
  }
}
