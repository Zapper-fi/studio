import { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ConvexFarmContractPositionFetcher } from '../common/convex.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumConvexLpFarmContractPositionFetcher extends ConvexFarmContractPositionFetcher {
  groupLabel = 'Liqudity Pool Staking';

  async getFarmAddresses() {
    const address = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const contract = this.contractFactory.convexBooster({ address, network: this.network });
    const numPools = await contract.poolLength().then(Number);
    return Promise.all(range(0, numPools).map(v => contract.poolInfo(v).then(p => p.crvRewards)));
  }
}
