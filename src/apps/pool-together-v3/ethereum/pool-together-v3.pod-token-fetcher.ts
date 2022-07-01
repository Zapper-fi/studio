import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV3PodTokenHelper } from '../helpers/pool-together-v3.pod.token-helper';
import { POOL_TOGETHER_V3_DEFINITION } from '../pool-together-v3.definition';

const appId = POOL_TOGETHER_V3_DEFINITION.id;
const groupId = POOL_TOGETHER_V3_DEFINITION.groups.pod.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumPoolTogetherV3PodTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV3PodTokenHelper)
    private readonly poolTogetherV3PodTokenHelper: PoolTogetherV3PodTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherV3PodTokenHelper.getTokens({
      network,
      registryAddress: '0x4658f736b93dcddcbce46cde955970e697fd351f',
    });
  }
}
