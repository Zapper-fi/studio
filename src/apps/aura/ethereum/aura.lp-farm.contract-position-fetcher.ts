import { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumAuraLpFarmContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'Liquidity Pool Staking';

  balancerTokenAddress = '0xba100000625a3754423978a60c9317c58a424e3d';
  auraTokenAddress = '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf';

  BOOSTER_V1_ADDRESS = '0x7818a1da7bd1e64c199029e86ba244a9798eee10';
  boosterMultiplierAddress = '0xa57b8d98dae62b26ec3bcc4a365338157060b234';

  async getFarmAddresses() {
    const boosters = [this.BOOSTER_V1_ADDRESS, this.boosterMultiplierAddress].map(booster =>
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
