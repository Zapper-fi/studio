import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher } from '../common/kyberswap-classic.farm-fairlaunch-v2.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainKyberSwapClassicFarmV2ContractPositionFetcher extends KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher {
  groupLabel = 'Farms';

  // Check docs for more info: https://github.com/KyberNetwork/kyberswap-interface/blob/main/src/constants/networks/bnb.ts
  chefAddresses = ['0x3474b537da4358a08f916b1587dccdd9585376a4'];
}
