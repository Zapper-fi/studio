import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { RariFuseBorrowContractPositionFetcher } from '../common/rari-fuse.borrow.contract-position-fetcher';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Injectable()
export class EthereumRariFuseBorrowContractPositionFetcher extends RariFuseBorrowContractPositionFetcher {
  appId = RARI_FUSE_DEFINITION.id;
  groupId = RARI_FUSE_DEFINITION.groups.borrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
}
