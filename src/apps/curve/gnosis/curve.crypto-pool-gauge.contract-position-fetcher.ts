import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveStablePoolGaugeContractPositionFetcher } from '../common/curve.stable-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class GnosisCurveCryptoPoolGaugeContractPositionFetcher extends CurveStablePoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  registryAddress = '0x8a4694401be8f8fccbc542a3219af1591f87ce17';
  crvTokenAddress = '0x712b3d230f3c1c19db860d80619288b1f0bdd0bd';
}
