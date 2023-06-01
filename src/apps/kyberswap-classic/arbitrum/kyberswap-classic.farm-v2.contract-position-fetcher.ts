import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher } from '../common/kyberswap-classic.farm-fairlaunch-v2.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher {
  groupLabel = 'Farms';

  // Check docs for more info: https://github.com/KyberNetwork/kyberswap-interface/blob/main/src/constants/networks/arbitrum.ts
  chefAddresses = ['0xe8144386bf00f168ed7a0e0d821ac18e02a461ba'];
}
