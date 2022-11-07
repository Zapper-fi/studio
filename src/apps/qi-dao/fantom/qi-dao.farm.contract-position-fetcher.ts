import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoFarmContractPositionFetcher } from '../common/qi-dao.farm.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class FantomQiDaoFarmContractPositionFetcher extends QiDaoFarmContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.farm.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Farms';

  chefAddresses = ['0x230917f8a262bf9f2c3959ec495b11d1b7e1affc', '0xff8e9ad7ab6dac78cba9aaf74cfa7d96132233d4'];
}
