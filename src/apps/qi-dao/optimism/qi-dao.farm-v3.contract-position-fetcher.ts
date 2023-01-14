import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoFarmV3ContractPositionFetcher } from '../common/qi-dao.farm-v3.contract-position-fetcher';

@PositionTemplate()
export class OptimismQiDaoFarmV3ContractPositionFetcher extends QiDaoFarmV3ContractPositionFetcher {
  groupLabel = 'Farms';

  chefAddresses = ['0xc09c73f7b32573d178138e76c0e286ba21085c20'];
}
