import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class EthereumRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel: string = 'Ethereum Smart Pools';
}
