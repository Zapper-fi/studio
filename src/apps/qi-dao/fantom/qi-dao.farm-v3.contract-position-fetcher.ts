import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoFarmV3ContractPositionFetcher } from '../common/qi-dao.farm-v3.contract-position-fetcher';

@PositionTemplate()
export class FantomQiDaoFarmV3ContractPositionFetcher extends QiDaoFarmV3ContractPositionFetcher {
  groupLabel = 'Farms';

  chefAddresses = ['0xdbfee091d6bef662bf3c79c3f08eff3a0cc94bde'];
}
