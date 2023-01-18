import 'moment-duration-format';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AcrossV2PoolTokenFetcher } from '../common/across.v2-pool.token-fetcher';

@PositionTemplate()
export class EthereumAcrossV2PoolTokenFetcher extends AcrossV2PoolTokenFetcher {
  groupLabel = 'V2 Pools';
  hubAddress = '0xc186fa914353c44b2e33ebe05f21846f1048beda';
}
