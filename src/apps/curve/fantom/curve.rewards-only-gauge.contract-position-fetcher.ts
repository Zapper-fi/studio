import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';

@PositionTemplate()
export class FantomCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  gaugeAddresses = [
    '0x00702bbdead24c40647f235f15971db0867f6bdb',
    '0x8866414733f22295b7563f9c5299715d2d76caf4',
    '0xbdff0c27dd073c119ebcb1299a68a6a92ae607f0',
    '0xd4f94d0aaa640bbb72b5eec2d85f6d114d81a88e',
    '0xdee85272eae1ab4afbc6433f4d819babc9c7045a',
  ];
}
