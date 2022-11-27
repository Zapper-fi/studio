import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxEsGmxTokenFetcher } from '../common/gmx.es-gmx.token-fetcher';

@PositionTemplate()
export class ArbitrumGmxEsGmxTokenFetcher extends GmxEsGmxTokenFetcher {
  groupLabel = 'esGMX';
  isExcludedFromTvl = true;

  esGmxAddress = '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca';
  gmxAddress = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a';
}
