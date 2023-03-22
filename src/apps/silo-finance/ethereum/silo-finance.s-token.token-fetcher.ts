import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSTokenTokenFetcher } from '../common/silo-finance.s-token.token-fetcher';

@PositionTemplate()
export class EthereumSTokenTokenFetcher extends SiloFinanceSTokenTokenFetcher {
  groupLabel = 'S Tokens';

  siloLensAddress = '0xf12c3758c1ec393704f0db8537ef7f57368d92ea';
}
