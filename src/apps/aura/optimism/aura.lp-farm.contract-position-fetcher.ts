import { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';

@PositionTemplate()
export class OptimismAuraLpFarmContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'Liquidity Pool Staking';

  balancerTokenAddress = '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921';
  auraTokenAddress = '0x1509706a6c66ca549ff0cb464de88231ddbe213b';

  boosterMultiplierAddress = '0x98ef32edd24e2c92525e59afc4475c1242a30184';

  async getFarmAddresses() {
    const boosters = [this.boosterMultiplierAddress].map(booster =>
      this.contractFactory.auraBooster({ address: booster, network: this.network }),
    );

    const addresses = await Promise.all(
      boosters.map(async contract => {
        const numPools = await contract.read.poolLength().then(Number);
        return Promise.all(range(0, numPools).map(v => contract.read.poolInfo([BigInt(v)]).then(p => p[3])));
      }),
    );

    return addresses.flat();
  }
}
