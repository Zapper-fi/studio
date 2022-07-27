import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultPoolTokenHelper } from '../helpers/pool/curve.default.token-helper';
import { CurvePoolTokenRegistry } from '../helpers/pool/curve.pool-token.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.HARMONY_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class HarmonyCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveDefaultPoolTokenHelper)
    private readonly curveDefaultPoolTokenHelper: CurveDefaultPoolTokenHelper,
    @Inject(CurvePoolTokenRegistry)
    private readonly curvePoolTokenRegistry: CurvePoolTokenRegistry,
  ) {}

  async getPositions() {
    return this.curveDefaultPoolTokenHelper.getTokens({
      network,
      poolDefinitions: await this.curvePoolTokenRegistry.getPoolDefinitions(network),
    });
  }
}
