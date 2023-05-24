import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel: string = 'Smart Pools';
  const blockedTokenAddresses = ['0x0000000000000000000000000000000000000001'];
}
