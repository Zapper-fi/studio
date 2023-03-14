import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkGTokenTokenFetcher } from '../common/gains-network.g-token.token-fetcher';

@PositionTemplate()
export class ArbitrumGainsNetworkGTokenTokenFetcher extends GainsNetworkGTokenTokenFetcher {
  async getAddresses() {
    return ['0xd85e038593d7a098614721eae955ec2022b9b91b'];
  }
}
