import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultPoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';
import { CurveOnChainRegistry } from '../helpers/registry/curve.on-chain.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveOnChainRegistry)
    private readonly curveOnChainRegistry: CurveOnChainRegistry,
    @Inject(CurveDefaultPoolTokenHelper)
    private readonly curveDefaultPoolTokenHelper: CurveDefaultPoolTokenHelper,
  ) {}

  async getPositions() {
    return this.curveDefaultPoolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      poolDefinitions: await this.curveOnChainRegistry.getPoolDefinitions(network),
    });
  }
}
