import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ClaimableTemplatePositionFetcher } from '../helpers/aave-v2.claimable.template.contract-position-fetcher';

@Injectable()
export class EthereumAaveV2ClaimableContractPositionFetcher extends AaveV2ClaimableTemplatePositionFetcher {
  network = Network.ETHEREUM_MAINNET;
  appId = AAVE_V2_DEFINITION.id;
  groupId = AAVE_V2_DEFINITION.groups.claimable.id;
  groupLabel = 'Rewards';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  incentivesControllerAddress = '0xd784927ff2f95ba542bfc824c8a8a98f3495f6b5';
  protocolDataProviderAddress = '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d';
  rewardTokenAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
}
