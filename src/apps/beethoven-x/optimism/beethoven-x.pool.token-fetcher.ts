import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class OptimismBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-optimism-v2.beets-ftm-node.com/';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
  composablePoolFactories = [
    '0xf145cafb67081895ee80eb7c04a30cf87f07b745',
    '0xe2e901ab09f37884ba31622df3ca7fc19aa443be',
    '0xe2e901ab09f37884ba31622df3ca7fc19aa443be',
  ];
  weightedPoolV2Factories = [
    '0xad901309d9e9dbc5df19c84f729f429f0189a633',
    '0xa0dabebaad1b243bbb243f933013d560819eb66f',
    '0xa0dabebaad1b243bbb243f933013d560819eb66f',
  ];

  groupLabel = 'Pools';
}
