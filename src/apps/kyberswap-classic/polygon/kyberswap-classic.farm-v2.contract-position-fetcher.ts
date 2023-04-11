import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher } from '../common/kyberswap-classic.farm-fairlaunch-v2.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberSwapClassicFarmV2ContractPositionFetcher extends KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher {
  groupLabel = 'Farms';

  // Check docs for more info: https://github.com/KyberNetwork/kyberswap-interface/blob/main/src/constants/networks/matic.ts
  chefAddresses = ['0xffd22921947d75342bfe1f8efacee4b8b3b5183f', '0x0baf410dcfcf168f659f46bf1e28d29f68a25e77'];
}
