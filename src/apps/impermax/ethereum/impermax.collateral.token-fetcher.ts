import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ImpermaxCollateralTokenFetcher } from '../helpers/impermax.collateral.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class EthereumImpermaxCollateralTokenFetcher extends ImpermaxCollateralTokenFetcher {
  appId = IMPERMAX_DEFINITION.id;
  groupId = IMPERMAX_DEFINITION.groups.collateral.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending Pool';

  factoryAddress = '0x8c3736e2fe63cc2cd89ee228d9dbcab6ce5b767b';
}
