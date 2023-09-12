import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class AvalancheKyberSwapDmmClassicDmmPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'DMM Pools';
  factoryAddress = '0x10908c875d865c66f271f5d3949848971c9595c9';
}
