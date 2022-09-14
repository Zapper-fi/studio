import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ImpermaxCollateralTokenFetcher } from '../helpers/impermax.collateral.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class PolygonImpermaxCollateralTokenFetcher extends ImpermaxCollateralTokenFetcher {
  appId = IMPERMAX_DEFINITION.id;
  groupId = IMPERMAX_DEFINITION.groups.collateral.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Collateral';

  factoryAddress = '0xbb92270716c8c424849f17ccc12f4f24ad4064d6';
}
