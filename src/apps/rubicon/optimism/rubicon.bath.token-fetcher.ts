import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RubiconBathTokenFetcher } from '../common/rubicon.pool.token-fetcher';

@PositionTemplate()
export class OptimismRubiconBathTokenFetcher extends RubiconBathTokenFetcher {
  groupLabel = 'Bath Tokens';
}
