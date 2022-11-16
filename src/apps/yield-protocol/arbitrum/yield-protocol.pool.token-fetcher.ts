import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolPoolTokenFetcher } from '../common/yield-protocol.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumYieldProtocolPoolTokenFetcher extends YieldProtocolPoolTokenFetcher {
  groupLabel = 'Pools';
  poolTokenAddresses = [
    '0xe779cd75e6c574d83d3fd6c92f3cbe31dd32b1e1',
    '0xe7214af14bd70f6aac9c16b0c1ec9ee1ccc7efda',
    '0x92a5b31310a3ed4546e0541197a32101fcfbd5c8',
    '0xdc705fb403dbb93da1d28388bc1dc84274593c11',
  ];
}
