import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurvePoolDefaultTokenHelper } from '../helpers/curve.pool.default.token-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.HARMONY_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class HarmonyCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolDefaultTokenHelper)
    private readonly curvePoolDefaultTokenHelper: CurvePoolDefaultTokenHelper,
  ) {}

  async getPositions() {
    return this.curvePoolDefaultTokenHelper.getTokens({ network });
  }
}
