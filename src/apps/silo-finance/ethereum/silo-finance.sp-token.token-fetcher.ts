import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SiloFinanceSpTokenTokenFetcher } from '../common/silo-finance.sp-asset.token-fetcher';

@PositionTemplate()
export class EthereumSPTokenTokenFetcher extends SiloFinanceSpTokenTokenFetcher {
  groupLabel = 'SP Tokens';
}
