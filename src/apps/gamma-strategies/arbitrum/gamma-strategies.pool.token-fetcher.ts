import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GammaStrategiesPoolTokenFetcher } from '../common/gamma-strategies.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumGammaStrategiesPoolTokenFetcher extends GammaStrategiesPoolTokenFetcher {
  groupLabel = 'Pools';
}
