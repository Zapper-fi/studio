import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ConvexBoosterContractPositionFetcher } from '../common/convex.booster.contract-position-fetcher';

@PositionTemplate()
export class PolygonConvexBoosterContractPositionFetcher extends ConvexBoosterContractPositionFetcher {
  groupLabel = 'Booster';
  boosterAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;
}
