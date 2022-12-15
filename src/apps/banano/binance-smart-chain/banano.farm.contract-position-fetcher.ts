import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BananoFarmContractPositionFetcher } from '../common/banano.farm.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainBananoFarmContractPositionFetcher extends BananoFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x1e30e12e82956540bf870a40fd1215fc083a3751';
}
