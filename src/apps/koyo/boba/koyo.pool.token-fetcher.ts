import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KoyoPoolTokensHelper } from '../helpers/koyo.pool.token-helper';
import { KoyoTheGraphPoolTokenDataStrategy } from '../helpers/koyo.the-graph.pool-token-address-strategy';
import { KOYO_DEFINITION } from '../koyo.definition';

const appId = KOYO_DEFINITION.id;
const groupId = KOYO_DEFINITION.groups.pool.id;
const network = Network.BOBA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BobaKoyoPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(KoyoPoolTokensHelper) private readonly poolTokensHelper: KoyoPoolTokensHelper,
    @Inject(KoyoTheGraphPoolTokenDataStrategy)
    private readonly koyoTheGraphPoolTokenDataStrategy: KoyoTheGraphPoolTokenDataStrategy,
  ) {}

  getPositions() {
    return this.poolTokensHelper.getTokenMarketData({
      network,
      appId,
      groupId,
      vaultAddress: '0x2a4409cc7d2ae7ca1e3d915337d1b6ba2350d6a3',
      resolvePoolTokenAddresses: this.koyoTheGraphPoolTokenDataStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-boba',
      }),
    });
  }
}
