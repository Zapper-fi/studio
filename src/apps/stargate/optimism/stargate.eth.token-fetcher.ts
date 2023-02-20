import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';

@PositionTemplate()
export class OptimismStargateEthTokenFetcher extends StargateEthTokenFetcher {
  groupLabel = 'Wrapped';

  stargateEthAddress = '0xd22363e3762ca7339569f3d33eade20127d5f98c';
}
