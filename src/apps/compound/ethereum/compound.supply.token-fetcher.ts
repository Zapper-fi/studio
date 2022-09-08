import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { CompoundSupplyTokenFetcher } from '../common/compound.supply.token-fetcher';
import { COMPOUND_DEFINITION } from '../compound.definition';

@Injectable()
export class EthereumCompoundSupplyTokenFetcher extends CompoundSupplyTokenFetcher {
  appId = COMPOUND_DEFINITION.id;
  groupId = COMPOUND_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';
}
