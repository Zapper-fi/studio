import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmContractPositionFetcher } from '../common/kyberswap-classic.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x89929bc485ce72d2af7b7283b40b921e9f4f80b3';
}
