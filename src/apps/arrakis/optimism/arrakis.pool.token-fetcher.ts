import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ArrakisPoolTokenFetcher } from '../common/arrakis.pool.token-fetcher';

@PositionTemplate()
export class OptimismArrakisPoolTokenFetcher extends ArrakisPoolTokenFetcher {
  groupLabel = 'Pools';
}
