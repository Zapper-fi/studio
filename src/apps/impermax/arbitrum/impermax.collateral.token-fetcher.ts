import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ImpermaxCollateralTokenFetcher } from '../common/impermax.collateral.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class ArbitrumImpermaxCollateralTokenFetcher extends ImpermaxCollateralTokenFetcher {
  appId = IMPERMAX_DEFINITION.id;
  groupId = IMPERMAX_DEFINITION.groups.collateral.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Lending Pool';

  factoryAddress = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';
}
