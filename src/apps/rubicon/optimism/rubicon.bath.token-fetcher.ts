import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { RubiconBathTokenFetcher } from '../common/rubicon.pool.token-fetcher';
import { RUBICON_DEFINITION } from '../rubicon.definition';

@Injectable()
export class OptimismRubiconBathTokenFetcher extends RubiconBathTokenFetcher {
  appId = RUBICON_DEFINITION.id;
  groupId = RUBICON_DEFINITION.groups.bath.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Bath Tokens';
}
