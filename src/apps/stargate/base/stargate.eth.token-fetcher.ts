import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateEthTokenFetcher } from '../common/stargate.eth.token-fetcher';

@PositionTemplate()
export class BaseStargateEthTokenFetcher extends StargateEthTokenFetcher {
  groupLabel = 'Wrapped';

  stargateEthAddress = '0x224d8fd7ab6ad4c6eb4611ce56ef35dec2277f03';
}
