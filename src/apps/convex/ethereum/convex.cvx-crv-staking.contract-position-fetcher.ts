import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { ConvexFarmContractPositionFetcher } from '../common/convex.farm.contract-position-fetcher';
import { CONVEX_DEFINITION } from '../convex.definition';

const appId = CONVEX_DEFINITION.id;
const groupId = CONVEX_DEFINITION.groups.cvxCrvStaking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumConvexCvxCrvStakingContractPositionFetcher extends ConvexFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;

  getFarmAddresses() {
    return ['0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e'];
  }
}
