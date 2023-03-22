import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { SingleStakingFarmDefinition } from '~position/template/single-staking.template.contract-position-fetcher';

import { GainsNetworkStakingContractPositionFetcher } from '../common/gains-network.staking.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGainsNetworkStakingContractPositionFetcher extends GainsNetworkStakingContractPositionFetcher {
  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0x6b8d3c08072a020ac065c467ce922e3a36d3f9d6',
        stakedTokenAddress: '0x18c11fd286c5ec11c3b683caa813b77f5163a122',
        rewardTokenAddresses: ['0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'],
      },
    ];
  }
}
