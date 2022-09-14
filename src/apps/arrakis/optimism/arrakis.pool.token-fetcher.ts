import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ARRAKIS_DEFINITION } from '../arrakis.definition';
import { ArrakisPoolTokenFetcher } from '../common/arrakis.pool.token-fetcher';

const appId = ARRAKIS_DEFINITION.id;
const groupId = ARRAKIS_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

@Injectable()
export class OptimismArrakisPoolTokenFetcher extends ArrakisPoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';
}
