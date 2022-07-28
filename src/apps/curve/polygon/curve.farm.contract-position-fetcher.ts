import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultFarmContractPositionHelper } from '../helpers/gauge/curve.default.farm.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveDefaultFarmContractPositionHelper)
    private readonly curveDefaultFarmContractPositionHelper: CurveDefaultFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveDefaultFarmContractPositionHelper.getPositions({
      network,
      crvTokenAddress: '0x172370d5cd63279efa6d502dab29171933a610af',
    });
  }
}
