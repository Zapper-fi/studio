import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { BalancerV2PoolLabelStrategy, BalancerV2PoolTokensHelper } from '~apps/balancer-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXTheGraphPoolTokenDataStrategy } from '../helpers/beethoven-x.the-graph.pool-token-address-strategy';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismBeethovenXPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BalancerV2PoolTokensHelper) private readonly poolTokensHelper: BalancerV2PoolTokensHelper,
    @Inject(BeethovenXTheGraphPoolTokenDataStrategy)
    private readonly beethovenXTheGraphPoolTokenDataStrategy: BeethovenXTheGraphPoolTokenDataStrategy,
  ) {}

  async getPositions() {
    const tokens = await this.poolTokensHelper.getPositions({
      network,
      appId,
      groupId,
      vaultAddress: '0xba12222222228d8ba445958a75a0704d566bf2c8',
      minLiquidity: 10000,
      resolvePoolLabelStrategy: () => BalancerV2PoolLabelStrategy.POOL_NAME,
      resolvePoolTokenAddresses: this.beethovenXTheGraphPoolTokenDataStrategy.build({
        subgraphUrl: 'https://backend-optimism.beets-ftm-node.com/',
        minLiquidity: 10000,
      }),
    });

    return compact(tokens);
  }
}
