import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoFarmV3ContractPositionFetcher } from '../common/qi-dao.farm-v3.contract-position-fetcher';

@PositionTemplate()
export class AvalancheQiDaoFarmV3ContractPositionFetcher extends QiDaoFarmV3ContractPositionFetcher {
  groupLabel = 'Farms';

  chefAddresses = ['0x0f680790d022bcdf317bf3e97190aca33a0621b2', '0x7754b08ab3b73021736985e90163acc68484f54a'];
}
