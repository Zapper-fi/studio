import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceDTokenTokenFetcher } from '../common/silo-finance.d-token.token-fetcher';

@PositionTemplate()
export class ArbitrumDTokenTokenFetcher extends SiloFinanceDTokenTokenFetcher {
  groupLabel = 'D Tokens';

  siloLensAddress = '0x2dd3fb3d8aabdeca8571bf5d5cc2969cb563a6e9';
}
