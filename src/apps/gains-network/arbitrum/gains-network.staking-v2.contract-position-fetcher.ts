import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkStakingV2ContractPositionFetcher } from '../common/gains-network.staking-v2.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGainsNetworkStakingV2ContractPositionFetcher extends GainsNetworkStakingV2ContractPositionFetcher {
  groupLabel = 'Staking';

  stakingContractAddress = '0x7edde7e5900633f698eab0dbc97de640fc5dc015';
}
