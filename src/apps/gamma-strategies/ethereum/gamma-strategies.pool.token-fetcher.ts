import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GammaStrategiesPoolTokenFetcher } from '../helpers/gamma-strategies.pool.token-fetcher'

@PositionTemplate()
export class EthereumGammaStrategiesPoolTokenFetcher extends GammaStrategiesPoolTokenFetcher {
  getDataUrls(): Array<string> {
    return [`https://gammawire.net/hypervisors/allData`]
  }
}
