import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DefiedgeStrategyTokenFetcher } from '../common/defiedge.strategy.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainDefiedgeStrategyTokenFetcher extends DefiedgeStrategyTokenFetcher {}
