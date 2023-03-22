import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSTokenTokenFetcher } from '../common/silo-finance.s-token.token-fetcher';

@PositionTemplate()
export class ArbitrumSTokenTokenFetcher extends SiloFinanceSTokenTokenFetcher {
  groupLabel = 'S Tokens';

  siloLensAddress = '0x2dd3fb3d8aabdeca8571bf5d5cc2969cb563a6e9';
}
