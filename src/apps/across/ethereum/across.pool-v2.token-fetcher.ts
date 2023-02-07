import 'moment-duration-format';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AcrossPoolV2TokenFetcher } from '../common/across.pool-v2.token-fetcher';

@PositionTemplate()
export class EthereumAcrossPoolV2TokenFetcher extends AcrossPoolV2TokenFetcher {
  groupLabel = 'Pools V2';
  hubAddress = '0xc186fa914353c44b2e33ebe05f21846f1048beda';
}
