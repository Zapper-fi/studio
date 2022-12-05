import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GoodGhostingGameContractPositionFetcher } from '../common/good-ghosting.game.contract-position-fetcher';

@PositionTemplate()
export class CeloGoodGhostingGameContractPositionFetcher extends GoodGhostingGameContractPositionFetcher {
  groupLabel = 'Games';
}
