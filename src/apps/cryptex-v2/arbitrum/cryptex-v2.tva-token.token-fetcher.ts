import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DsuTokenFetcher } from '../common/cryptex-v2.token.tva-token-fetcher';

@PositionTemplate()
export class ArbitrumTvaTokenFetcher extends TvaTokenFetcher {
  groupLabel = 'TVA';
  isExcludedFromTvl = false;

  tvaAddress = '0xea281a4c70ee2ef5ce3ed70436c81c0863a3a75a';
}
