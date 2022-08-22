import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PickleJarTokenFetcher } from '../common/pickle.jar.token-fetcher';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.jar.id;
const network = Network.ARBITRUM_MAINNET;

export type PickleJarDataProps = {
  liquidity: number;
  reserve: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumPickleJarTokenFetcher extends PickleJarTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
}
