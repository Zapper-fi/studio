import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';

@PositionTemplate()
export class AvalancheCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  gaugeAddresses = [
    '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
    '0x0f9cb53ebe405d49a0bbdbd291a65ff571bc83e1',
    '0x445fe580ef8d70ff569ab36e80c647af338db351',
  ];
}
