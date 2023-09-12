import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MahalendClaimablePositionFetcher } from '../common/mahalend.claimable.contract-position-fetcher';

@PositionTemplate()
export class EthereumMahalendClaimableContractPositionFetcher extends MahalendClaimablePositionFetcher {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0x7DEb36c5D3f2B4894a0a21De8D13D5d3a0981fE2';
  protocolDataProviderAddress = '0x3Bbf9f4762508b4DcC3C98B59030D33277949276';
  rewardTokenAddress = '0x745407c86DF8DB893011912d3aB28e68B62E49B0';
}
