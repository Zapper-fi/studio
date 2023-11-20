import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class OptimismBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-v3.beets-ftm-node.com/';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
  composablePoolFactories = [
    '0xf145cafb67081895ee80eb7c04a30cf87f07b745',
    '0xe2e901ab09f37884ba31622df3ca7fc19aa443be',
    '0x1802953277fd955f9a254b80aa0582f193cf1d77',
    '0x043a2dad730d585c44fb79d2614f295d2d625412',
  ];
  weightedPoolV2Factories = [
    '0xad901309d9e9dbc5df19c84f729f429f0189a633',
    '0xa0dabebaad1b243bbb243f933013d560819eb66f',
    '0x230a59f4d9adc147480f03b0d3fffecd56c3289a',
  ];

  groupLabel = 'Pools';
}
