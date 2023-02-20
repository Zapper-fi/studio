import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ClearpoolPoolTokenFetcher } from '../common/clearpool.pool.token-fetcher';

@PositionTemplate()
export class PolygonClearpoolPoolTokenFetcher extends ClearpoolPoolTokenFetcher {
  groupLabel = 'Pool';
}
