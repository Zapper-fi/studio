import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  gaugeAddresses = [
    '0xbf7e49483881c76487b0989cd7d9a8239b20ca41',
    '0xc2b1df84112619d190193e48148000e3990bf627',
    '0x97e2768e8e73511ca874545dc5ff8067eb19b787',
    '0x37c7ef6b0e23c9bd9b620a6dabbfec13ce30d824',
  ];
}
