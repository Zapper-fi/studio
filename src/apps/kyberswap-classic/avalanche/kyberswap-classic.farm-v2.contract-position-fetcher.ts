import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher } from '../common/kyberswap-classic.farm-fairlaunch-v2.contract-position-fetcher';

@PositionTemplate()
export class AvalancheKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher {
  groupLabel = 'Farms';

  // Check docs for more info: https://github.com/KyberNetwork/kyberswap-interface/blob/main/src/constants/networks/avax.ts
  chefAddresses = [
    '0x8e9bd30d15420bae4b7ec0ac014b7ecee864373c',
    '0x845d1d0d9b344fba8a205461b9e94aefe258b918',
    '0xa107e6466be74361840059a11e390200371a7538',
    '0x89929bc485ce72d2af7b7283b40b921e9f4f80b3',
    '0xc9b4001f0f858d2679cf6bbf4c1ce626b1390c0b',
    '0xf2d574807624bdad750436afa940563c5fa34726',
  ];
}
