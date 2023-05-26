import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class EthereumRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel = 'Smart Pools';

  blockedTokenAddresses = ['0x0000000000000000000000000000000000000001'];
}
