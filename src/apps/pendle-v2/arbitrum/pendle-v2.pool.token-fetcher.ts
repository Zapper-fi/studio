import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { PendleV2PoolTokenFetcher } from '../common/pendle-v2.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumPendleV2PoolTokenFetcher extends PendleV2PoolTokenFetcher {}
