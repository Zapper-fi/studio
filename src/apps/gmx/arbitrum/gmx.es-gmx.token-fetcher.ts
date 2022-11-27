import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { GmxEsGmxTokenFetcher } from '../common/gmx.es-gmx.token-helper';
import { GMX_DEFINITION } from '../gmx.definition';

@Injectable()
export class ArbitrumGmxEsGmxTokenFetcher extends GmxEsGmxTokenFetcher {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.esGmx.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'esGMX';
  isExcludedFromTvl = true;

  esGmxAddress = '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca';
  gmxAddress = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a';
}
