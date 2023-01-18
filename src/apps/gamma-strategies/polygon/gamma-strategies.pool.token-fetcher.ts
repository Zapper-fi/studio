import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GammaStrategiesPoolTokenFetcher } from '../helpers/gamma-strategies.pool.token-fetcher'

@PositionTemplate()
export class PolygonGammaStrategiesPoolTokenFetcher extends GammaStrategiesPoolTokenFetcher {
  getDataUrls(): Array<string> {
    return [...super.getDataUrls(), 'https://visordata-o9v9w.ondigitalocean.app/quickswap/polygon/hypervisors/allData']
  }
}
