import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { BalancerV2PoolLabelStrategy, BalancerV2PoolTokensHelper } from '~apps/balancer-v2';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { YEARN_DEFINITION } from '~apps/yearn';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXTheGraphPoolTokenDataStrategy } from '../helpers/beethoven-x.the-graph.pool-token-address-strategy';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class FantomBeethovenXPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BalancerV2PoolTokensHelper) private readonly poolTokensHelper: BalancerV2PoolTokensHelper,
    @Inject(BeethovenXTheGraphPoolTokenDataStrategy)
    private readonly beethovenXTheGraphPoolTokenDataStrategy: BeethovenXTheGraphPoolTokenDataStrategy,
  ) {}

  async getPositions() {
    const tokens = await this.poolTokensHelper.getTokenMarketData({
      network,
      appId,
      groupId,
      appTokenDependencies: [
        {
          appId: OLYMPUS_DEFINITION.id,
          groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id],
          network,
        },
        {
          appId: BEETHOVEN_X_DEFINITION.id,
          groupIds: [BEETHOVEN_X_DEFINITION.groups.fBeets.id],
          network,
        },
        {
          appId: YEARN_DEFINITION.id,
          groupIds: [YEARN_DEFINITION.groups.v2Vault.id],
          network,
        },
        {
          appId: 'wonderland',
          groupIds: ['w-memo'],
          network,
        },
        {
          appId: 'popsicle',
          groupIds: ['nIce'],
          network,
        },
      ],
      vaultAddress: '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce',
      minLiquidity: 10000,
      resolvePoolLabelStrategy: () => BalancerV2PoolLabelStrategy.POOL_NAME,
      resolvePoolTokenAddresses: this.beethovenXTheGraphPoolTokenDataStrategy.build({
        subgraphUrl: 'https://backend.beets-ftm-node.com/graphql',
        minLiquidity: 10000,
      }),
    });

    return compact(tokens);
  }
}
