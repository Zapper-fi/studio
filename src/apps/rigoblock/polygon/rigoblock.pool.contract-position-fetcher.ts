import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolContractPositionFetcher } from '../common/rigoblock.pool.contract-position-fetcher';

@PositionTemplate()
export class PolygonRigoblockPoolContractPositionFetcher extends RigoblockPoolContractPositionFetcher {
  groupLabel = 'Smart Pools';

  positionManagerAddress = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
  factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
}
