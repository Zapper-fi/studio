import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GammaStrategiesPoolTokenFetcher } from '../helpers/gamma-strategies.pool.token-fetcher'

@PositionTemplate()
export class OptimismGammaStrategiesPoolTokenFetcher extends GammaStrategiesPoolTokenFetcher {
}
