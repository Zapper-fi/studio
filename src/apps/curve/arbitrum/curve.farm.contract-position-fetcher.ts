import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultFarmContractPositionHelper } from '../helpers/gauge/curve.default.farm.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveDefaultFarmContractPositionHelper)
    private readonly curveDefaultFarmContractPositionHelper: CurveDefaultFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveDefaultFarmContractPositionHelper.getPositions({
      network,
      crvTokenAddress: '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
    });
  }
}
