import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { TempusPoolTokenFetcher } from '../common/tempus.pool.token-fetcher';

@PositionTemplate()
export class FantomTempusPoolTokenFetcher extends TempusPoolTokenFetcher {
  groupLabel = 'P-Y Tokens';
}
