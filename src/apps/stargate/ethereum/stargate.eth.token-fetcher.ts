import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';

@PositionTemplate()
export class EthereumStargateEthTokenFetcher extends StargateEthTokenFetcher {
  groupLabel = 'Wrapped';

  stargateEthAddress = '0x72e2f4830b9e45d52f80ac08cb2bec0fef72ed9c';
}
