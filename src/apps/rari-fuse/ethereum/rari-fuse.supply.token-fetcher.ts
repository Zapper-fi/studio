import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { RariFuseSupplyTokenFetcher } from '../common/rari-fuse.supply.token-fetcher';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Injectable()
export class EthereumRariFuseSupplyTokenFetcher extends RariFuseSupplyTokenFetcher {
  appId = RARI_FUSE_DEFINITION.id;
  groupId = RARI_FUSE_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
}
