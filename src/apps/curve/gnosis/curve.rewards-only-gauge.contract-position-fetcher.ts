import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';

@PositionTemplate()
export class GnosisCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  gaugeAddresses = ['0x78cf256256c8089d68cde634cf7cdefb39286470'];
}
