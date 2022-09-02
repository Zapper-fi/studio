import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ClaimableTemplatePositionFetcher } from '../helpers/aave-v2.claimable.template.contract-position-fetcher';

@Injectable()
export class AvalancheAaveV2ClaimableContractPositionFetcher extends AaveV2ClaimableTemplatePositionFetcher {
  appId = AAVE_V2_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;
  groupId = AAVE_V2_DEFINITION.groups.claimable.id;
  groupLabel = 'Rewards';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0x01d83fe6a10d2f2b7af17034343746188272cac9';
  protocolDataProviderAddress = '0x65285e9dfab318f57051ab2b139cccf232945451';
  rewardTokenAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
}
