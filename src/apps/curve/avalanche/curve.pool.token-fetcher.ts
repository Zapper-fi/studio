import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurvePoolDefaultTokenHelper } from '../helpers/curve.pool.default.token-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolDefaultTokenHelper)
    private readonly curvePoolDefaultTokenHelper: CurvePoolDefaultTokenHelper,
  ) {}

  async getPositions() {
    return this.curvePoolDefaultTokenHelper.getTokens({
      network,
      dependencies: [{ appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network }],
    });
  }
}
