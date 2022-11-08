import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoFarmContractPositionFetcher } from '../common/qi-dao.farm.contract-position-fetcher';

@PositionTemplate()
export class FantomQiDaoFarmContractPositionFetcher extends QiDaoFarmContractPositionFetcher {
  groupLabel = 'Farms';

  chefAddresses = ['0x230917f8a262bf9f2c3959ec495b11d1b7e1affc', '0xff8e9ad7ab6dac78cba9aaf74cfa7d96132233d4'];
}
