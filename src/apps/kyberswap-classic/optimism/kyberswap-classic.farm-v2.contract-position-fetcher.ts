import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher } from '../common/kyberswap-classic.farm-fairlaunch-v2.contract-position-fetcher';

@PositionTemplate()
export class OptimismKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher {
  groupLabel = 'Farms';

  // Check docs for more info: https://github.com/KyberNetwork/kyberswap-interface/blob/main/src/constants/networks/optimism.ts
  chefAddresses = ['0x715cc6c0d591ca3fa8ea6e4cb445ada0dc79069a'];
}
