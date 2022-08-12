import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl: 'https://backend.beets-ftm-node.com/graphql';
  vaultAddress: '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce';
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.pool.id;
  network = Network.FANTOM_OPERA_MAINNET;
}
