import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PendleV2PrincipalTokenFetcher } from '../common/pendle-v2.principal.token-fetcher';

@PositionTemplate()
export class ArbitrumPendleV2PrincipalTokenFetcher extends PendleV2PrincipalTokenFetcher {}
