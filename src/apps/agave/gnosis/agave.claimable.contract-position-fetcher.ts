import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AaveV2ClaimablePositionFetcher } from '~apps/aave-v2/common/aave-v2.claimable.contract-position-fetcher';

@PositionTemplate()
export class GnosisAgaveClaimableContractPositionFetcher extends AaveV2ClaimablePositionFetcher {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0xfa255f5104f129b78f477e9a6d050a02f31a5d86';
  protocolDataProviderAddress = '0x24dcbd376db23e4771375092344f5cbea3541fc0';
  rewardTokenAddress = '0x3a97704a1b25f08aa230ae53b352e2e72ef52843';
}
