import { Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { Network } from '~types';

import { ConvexFarmContractPositionFetcher } from '../common/convex.farm.contract-position-fetcher';
import { CONVEX_DEFINITION } from '../convex.definition';

@Injectable()
export class EthereumConvexLpFarmContractPositionFetcher extends ConvexFarmContractPositionFetcher {
  appId = CONVEX_DEFINITION.id;
  groupId = CONVEX_DEFINITION.groups.lpFarm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Liqudity Pool Staking';

  async getFarmAddresses() {
    const address = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const contract = this.contractFactory.convexBooster({ address, network });
    const numPools = await contract.poolLength().then(Number);
    return Promise.all(range(0, numPools).map(v => contract.poolInfo(v).then(p => p.crvRewards)));
  }
}
