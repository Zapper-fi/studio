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
const network = Network.MOONRIVER_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class MoonriverKoyoPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
      vaultAddress: '0xEa1E627c12DF4e054D61FD408Ff7186353aC6cA1',
      resolvePoolTokenAddresses: this.koyoTheGraphPoolTokenDataStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-moonriver',
      }),
    });
  }
}
