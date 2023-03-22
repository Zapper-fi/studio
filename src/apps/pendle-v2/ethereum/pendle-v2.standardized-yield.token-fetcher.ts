import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PendleV2StandardizedYieldTokenFetcher } from '../common/pendle-v2.standardized-yield.token-fetcher';

@PositionTemplate()
export class EthereumPendleV2StandardizedYieldTokenFetcher extends PendleV2StandardizedYieldTokenFetcher {}
