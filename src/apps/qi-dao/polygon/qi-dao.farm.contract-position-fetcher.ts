import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { QiDaoFarmContractPositionFetcher } from '../common/qi-dao.farm.contract-position-fetcher';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class PolygonQiDaoFarmContractPositionFetcher extends QiDaoFarmContractPositionFetcher {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.farm.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Farms';

  chefAddresses = [
    '0x574fe4e8120c4da1741b5fd45584de7a5b521f0f',
    '0x07ca17da3b54683f004d388f206269ef128c2356',
    '0x0635af5ab29fc7bba007b8cebad27b7a3d3d1958',
  ];
}
