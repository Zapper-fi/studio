import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PendleV2YieldTokenFetcher } from '../common/pendle-v2.yield.token-fetcher';

@PositionTemplate()
export class EthereumPendleV2YieldTokenFetcher extends PendleV2YieldTokenFetcher {}
