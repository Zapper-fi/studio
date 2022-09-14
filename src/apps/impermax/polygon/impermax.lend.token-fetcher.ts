import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ImpermaxLendTokenFetcher } from '../helpers/impermax.lend.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class PolygonImpermaxLendTokenFetcher extends ImpermaxLendTokenFetcher {
  appId = IMPERMAX_DEFINITION.id;
  groupId = IMPERMAX_DEFINITION.groups.lend.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Lending Pool';

  factoryAddress = '0xbb92270716c8c424849f17ccc12f4f24ad4064d6';
}
