import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceDTokenTokenFetcher } from '../common/silo-finance.d-token.token-fetcher';

@PositionTemplate()
export class EthereumDTokenTokenFetcher extends SiloFinanceDTokenTokenFetcher {
  groupLabel = 'D Tokens';

  siloLensAddress = '0xf12c3758c1ec393704f0db8537ef7f57368d92ea';
}
