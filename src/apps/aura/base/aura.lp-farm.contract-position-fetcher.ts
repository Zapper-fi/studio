import { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';

@PositionTemplate()
export class BaseAuraLpFarmContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'Liquidity Pool Staking';

  boosterMultiplierAddress = '0x98ef32edd24e2c92525e59afc4475c1242a30184';

  async getFarmAddresses() {
    const boosters = [this.boosterMultiplierAddress].map(booster =>
      this.contractFactory.auraBooster({ address: booster, network: this.network }),
    );

    const addresses = await Promise.all(
      boosters.map(async contract => {
        const numPools = await contract.poolLength().then(Number);
        return Promise.all(range(0, numPools).map(v => contract.poolInfo(v).then(p => p.crvRewards)));
      }),
    );

    return addresses.flat();
  }
}
