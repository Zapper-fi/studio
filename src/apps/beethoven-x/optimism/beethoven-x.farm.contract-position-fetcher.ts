import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXFarmContractPositionFetcher } from '../common/beethoven-x.farm.contract-position-fetcher';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismBeethovenXFarmContractPositionFetcher extends BeethovenXFarmContractPositionFetcher {
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.farm.id;
  network = Network.OPTIMISM_MAINNET;
  subgraphUrl = 'https://backend-optimism.beets-ftm-node.com/';
}
