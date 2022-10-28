import { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumAuraLpFarmContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'Liquidity Pool Staking';

  async getFarmAddresses() {
    const address = '0x7818a1da7bd1e64c199029e86ba244a9798eee10';
    const contract = this.contractFactory.auraBooster({ address, network: this.network });
    const numPools = await contract.poolLength().then(Number);
    return Promise.all(range(0, numPools).map(v => contract.poolInfo(v).then(p => p.crvRewards)));
  }
}
