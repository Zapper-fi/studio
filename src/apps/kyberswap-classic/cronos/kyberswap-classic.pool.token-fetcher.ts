import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class CronosKyberSwapClassicPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0xd9bfe9979e9ca4b2fe84ba5d4cf963bbcb376974';
}
