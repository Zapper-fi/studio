import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BalancerV2PoolTokensHelper } from '~apps/balancer-v2';
import { BalancerV2TheGraphPoolTokenDataStrategy } from '~apps/balancer-v2/helpers/balancer-v2.the-graph.pool-token-address-strategy';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KOYO_DEFINITION } from '../koyo.definition';

const appId = KOYO_DEFINITION.id;
const groupId = KOYO_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonKoyoPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BalancerV2PoolTokensHelper) private readonly poolTokensHelper: BalancerV2PoolTokensHelper,
    @Inject(BalancerV2TheGraphPoolTokenDataStrategy)
    private readonly theGraphPoolTokenDataStrategy: BalancerV2TheGraphPoolTokenDataStrategy,
  ) {}

  getPositions() {
    return this.poolTokensHelper.getPositions({
      network,
      appId,
      groupId,
      vaultAddress: '0xacf8489ccb47da2d7306d827bbede05bfa6fea1b',
      resolvePoolTokenAddresses: this.theGraphPoolTokenDataStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-matic',
      }),
    });
  }
}
