import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BananoFarmContractPositionFetcher } from '../common/banano.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonBananoFarmContractPositionFetcher extends BananoFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0xefa4aed9cf41a8a0fcda4e88efa2f60675baec9f';
}
