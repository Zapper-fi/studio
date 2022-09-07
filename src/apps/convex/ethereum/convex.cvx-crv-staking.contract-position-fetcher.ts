import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ConvexFarmContractPositionFetcher } from '../common/convex.farm.contract-position-fetcher';
import { CONVEX_DEFINITION } from '../convex.definition';

@Injectable()
export class EthereumConvexCvxCrvStakingContractPositionFetcher extends ConvexFarmContractPositionFetcher {
  appId = CONVEX_DEFINITION.id;
  groupId = CONVEX_DEFINITION.groups.cvxCrvStaking.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'cvxCRV Staking';

  getFarmAddresses() {
    return ['0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e'];
  }
}
