import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DsuTokenFetcher } from '../common/cryptex-v2.token.dsu-token-fetcher';

@PositionTemplate()
export class ArbitrumDsuTokenFetcher extends DsuTokenFetcher {
  groupLabel = 'DSU';
  isExcludedFromTvl = true;

  dsuAddress = '0x52c64b8998eb7c80b6f526e99e29abdcc86b841b';
}
