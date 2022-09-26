import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  groupLabel = 'Pool';
  factoryAddress = '0x55bdb4164d28fbaf0898e0ef14a589ac09ac9970';
  useLocalDecimals = false;
}
