import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSpTokenTokenFetcher } from '../common/silo-finance.sp-token.token-fetcher';

@PositionTemplate()
export class ArbitrumSPTokenTokenFetcher extends SiloFinanceSpTokenTokenFetcher {
  groupLabel = 'SP Tokens';
}
