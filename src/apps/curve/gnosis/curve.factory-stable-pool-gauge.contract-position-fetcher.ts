import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolGaugeContractPositionFetcher } from '../common/curve.factory-stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class GnosisCurveFactoryStablePoolGaugeContractPositionFetcher extends CurveFactoryStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0xd19baeadc667cf2015e395f2b08668ef120f41f5';
  crvTokenAddress = '0x712b3d230f3c1c19db860d80619288b1f0bdd0bd';
}
