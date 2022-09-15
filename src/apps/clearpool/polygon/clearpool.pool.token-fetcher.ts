import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { CLEARPOOL_DEFINITION } from '../clearpool.definition';
import { ClearpoolPoolTokenFetcher } from '../common/clearpool.pool.token-fetcher';

@Injectable()
export class PolygonClearpoolPoolTokenFetcher extends ClearpoolPoolTokenFetcher {
  appId = CLEARPOOL_DEFINITION.id;
  groupId = CLEARPOOL_DEFINITION.groups.pool.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Pool';
}
