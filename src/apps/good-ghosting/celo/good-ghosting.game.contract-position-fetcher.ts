import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { GoodGhostingGameContractPositionFetcher } from '../common/good-ghosting.game.contract-position-fetcher';
import { GOOD_GHOSTING_DEFINITION } from '../good-ghosting.definition';

@Injectable()
export class CeloGoodGhostingGameContractPositionFetcher extends GoodGhostingGameContractPositionFetcher {
  appId = GOOD_GHOSTING_DEFINITION.id;
  groupId = GOOD_GHOSTING_DEFINITION.groups.game.id;
  network = Network.CELO_MAINNET;
  groupLabel = 'Games';
}
