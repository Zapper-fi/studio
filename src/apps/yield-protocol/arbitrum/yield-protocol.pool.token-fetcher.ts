import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolPoolTokenFetcher } from '../common/yield-protocol.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumYieldProtocolPoolTokenFetcher extends YieldProtocolPoolTokenFetcher {
  groupLabel = 'Pools';
  poolTokenAddresses = [
    '0xe779cd75e6c574d83d3fd6c92f3cbe31dd32b1e1',
    '0x92a5b31310a3ed4546e0541197a32101fcfbd5c8',
    '0xd5b43b2550751d372025d048553352ac60f27151',
    '0xa3caf61fd23d374ce13c742e4e9fa9fac23ddae6',
    '0x54f08092e3256131954dd57c04647de8b2e7a9a9',
    '0x3353e1e2976dbbc191a739871faa8e6e9d2622c7',
  ];
}
