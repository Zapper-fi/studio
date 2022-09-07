import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinPoolTokenFetcher } from '../common/aelin.pool.token-fetcher';

@Injectable()
export class OptimismAelinPoolTokenFetcher extends AelinPoolTokenFetcher {
  appId = AELIN_DEFINITION.id;
  groupId = AELIN_DEFINITION.groups.pool.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-optimism';
}
