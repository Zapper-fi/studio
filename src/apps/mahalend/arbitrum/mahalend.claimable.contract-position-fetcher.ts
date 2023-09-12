import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MahalendClaimablePositionFetcher } from '../common/mahalend.claimable.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumMahalendClaimableContractPositionFetcher extends MahalendClaimablePositionFetcher {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0x7DEb36c5D3f2B4894a0a21De8D13D5d3a0981fE2';
  protocolDataProviderAddress = '0xE76C1D2a7a56348574810e83D38c07D47f0641F3';
  rewardTokenAddress = '0xEB99748e91AfCA94a6289db3b02E7ef4a8f0A22d';
}
