import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveGaugeDefaultContractPositionHelper } from '../helpers/curve.gauge.default.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.gauge.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveGaugeDefaultContractPositionHelper)
    private readonly curveGaugeDefaultContractPositionHelper: CurveGaugeDefaultContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveGaugeDefaultContractPositionHelper.getPositions({
      network,
      crvTokenAddress: '0x172370d5cd63279efa6d502dab29171933a610af',
    });
  }
}
