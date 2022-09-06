import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3SponsorshipTokenFetcher } from '../common/pool-together-v3.sponsorship.token-fetcher';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

@Injectable()
export class PolygonPoolTogetherV3SponsorshipTokenFetcher extends PoolTogetherV3SponsorshipTokenFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.sponsorship.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Prize Pools';
  isExcludedFromExplore = true;
}
