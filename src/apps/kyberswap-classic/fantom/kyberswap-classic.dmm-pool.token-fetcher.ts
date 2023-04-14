import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class FantomKyberSwapClassicDmmPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'DMM Pools';
  factoryAddress = '0x78df70615ffc8066cc0887917f2cd72092c86409';
}
