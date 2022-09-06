import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { RubiconPoolTokenFetcher } from '../common/rubicon.pool.token-fetcher';
import { RUBICON_DEFINITION } from '../rubicon.definition';

const appId = RUBICON_DEFINITION.id;
const groupId = RUBICON_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismRubiconPoolTokenFetcher extends RubiconPoolTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';
}
