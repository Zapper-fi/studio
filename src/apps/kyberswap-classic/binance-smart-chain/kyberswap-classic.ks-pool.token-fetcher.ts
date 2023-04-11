import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicPoolTokenFetcher } from '../common/kyberswap-classic.pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainKyberSwapClassicKsPoolTokenFetcher extends KyberSwapClassicPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x1c758af0688502e49140230f6b0ebd376d429be5';
}
