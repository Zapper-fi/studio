import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveGaugeDefaultContractPositionHelper } from '../helpers/curve.gauge.default.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.gauge.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomCurveGaugeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveGaugeDefaultContractPositionHelper)
    private readonly curveGaugeDefaultContractPositionHelper: CurveGaugeDefaultContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveGaugeDefaultContractPositionHelper.getPositions({
      network,
      crvTokenAddress: '0x1e4f97b9f9f913c46f1632781732927b9019c68b',
    });
  }
}
