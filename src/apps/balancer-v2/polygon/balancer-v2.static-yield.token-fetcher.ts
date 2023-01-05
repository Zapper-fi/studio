import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2StaticYieldTokenFetcher } from '../common/balancer-v2.static-yield.token-fetcher';

@PositionTemplate()
export class PolygonBalancerV2StaticYieldTokenFetcher extends BalancerV2StaticYieldTokenFetcher {
  groupLabel = 'Static Yield';

  staticYieldTokenAddresses = [
    '0xee029120c72b0607344f35b17cdd90025e647b00', // amDAI
    '0x221836a597948dce8f3568e044ff123108acc42a', // amUSDC
    '0x19c60a251e525fa88cd6f3768416a8024e98fc19', // amUSDT
  ];
}
