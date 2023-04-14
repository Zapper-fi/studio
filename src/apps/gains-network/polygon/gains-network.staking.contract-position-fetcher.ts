import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { SingleStakingFarmDefinition } from '~position/template/single-staking.template.contract-position-fetcher';

import { GainsNetworkStakingContractPositionFetcher } from '../common/gains-network.staking.contract-position-fetcher';

@PositionTemplate()
export class PolygonGainsNetworkStakingContractPositionFetcher extends GainsNetworkStakingContractPositionFetcher {
  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xfb06a737f549eb2512eb6082a808fc7f16c0819d',
        stakedTokenAddress: '0xe5417af564e4bfda1c483642db72007871397896',
        rewardTokenAddresses: ['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'],
      },
    ];
  }
}
