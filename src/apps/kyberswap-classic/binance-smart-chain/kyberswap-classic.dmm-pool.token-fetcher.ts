import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainKyberSwapClassicDmmPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'DMM Pools';
  factoryAddress = '0x878dfe971d44e9122048308301f540910bbd934c';
}
