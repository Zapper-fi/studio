import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EaseRcaTokenFetcher } from '../common/ease.rca.token-fetcher';

@PositionTemplate()
export class EthereumEaseRcaTokenFetcher extends EaseRcaTokenFetcher {
  groupLabel = 'RCAs';
}
