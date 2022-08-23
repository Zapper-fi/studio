import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { RariFuseSupplyTokenFetcher } from '../common/rari-fuse.supply.token-fetcher';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

const appId = RARI_FUSE_DEFINITION.id;
const groupId = RARI_FUSE_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;
const groupLabel = 'Lending';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRariFuseSupplyTokenFetcher extends RariFuseSupplyTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = groupLabel;
}
