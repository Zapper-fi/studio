import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AaveV2ClaimableTemplatePositionFetcher } from '../helpers/aave-v2.claimable.template.contract-position-fetcher';

@PositionTemplate()
export class PolygonAaveV2ClaimableContractPositionFetcher extends AaveV2ClaimableTemplatePositionFetcher {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0x357d51124f59836ded84c8a1730d72b749d8bc23';
  protocolDataProviderAddress = '0x7551b5d2763519d4e37e8b81929d336de671d46d';
  rewardTokenAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
}
