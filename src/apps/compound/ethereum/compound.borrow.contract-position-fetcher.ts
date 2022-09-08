import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { CompoundBorrowContractPositionFetcher } from '../common/compound.borrow.contract-position-fetcher';
import { COMPOUND_DEFINITION } from '../compound.definition';

@Injectable()
export class EthereumCompoundBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher {
  appId = COMPOUND_DEFINITION.id;
  groupId = COMPOUND_DEFINITION.groups.borrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';
}
