import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkGTokenTokenFetcher } from '../common/gains-network.g-token.token-fetcher';

@PositionTemplate()
export class PolygonGainsNetworkGTokenTokenFetcher extends GainsNetworkGTokenTokenFetcher {
  async getAddresses() {
    return ['0x91993f2101cc758d0deb7279d41e880f7defe827'];
  }
}
