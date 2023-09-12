import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class FantomBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-v2.beets-ftm-node.com/graphql';
  vaultAddress = '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce';
  composablePoolFactories = [
    '0x5adaf6509bcec3219455348ac45d6d3261b1a990',
    '0xb384a86f2fd7788720db42f9daa60fc07ecbea06',
    '0x44814e3a603bb7f1198617995c5696c232f6e8ed',
    '0x911566c808bf00acb200b418564440a2af177548',
    '0x5c3094982cf3c97a06b7d62a6f7669f14a199b19',
  ];
  weightedPoolV2Factories = [
    '0xb2ed595afc445b47db7043bec25e772bf0fa1fbb',
    '0x8ea1c497c16726e097f62c8c9fbd944143f27090',
    '0xea87f3dffc679035653c0fba70e7bfe46e3fb733',
    '0xd678b6acd834cc969bb19ce82727f2a541fb7941',
  ];

  groupLabel = 'Pools';
}
