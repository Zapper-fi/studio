import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';

@PositionTemplate()
export class ArbitrumStargateEthTokenFetcher extends StargateEthTokenFetcher {
  groupLabel = 'Wrapped';

  stargateEthAddress = '0x915a55e36a01285a14f05de6e81ed9ce89772f8e';
}
