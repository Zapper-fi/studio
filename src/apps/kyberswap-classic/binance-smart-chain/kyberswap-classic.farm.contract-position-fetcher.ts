import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmContractPositionFetcher } from '../common/kyberswap-classic.farm.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x3474b537da4358a08f916b1587dccdd9585376a4';
}
