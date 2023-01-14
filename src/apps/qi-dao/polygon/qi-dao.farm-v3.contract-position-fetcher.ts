import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { QiDaoFarmV3ContractPositionFetcher } from '../common/qi-dao.farm-v3.contract-position-fetcher';

@PositionTemplate()
export class PolygonQiDaoFarmV3ContractPositionFetcher extends QiDaoFarmV3ContractPositionFetcher {
  groupLabel = 'Farms';

  chefAddresses = [
    '0x9f9f0456005ed4e7248199b6260752e95682a883',
    '0xcc54afcecd0d89e0b2db58f5d9e58468e7ad20dc',
    '0x1871178527a5f423f344b2c668e64a02d8783b8b',
    '0xbd9e831826786d9f2561695a140231f3353c608c',
    '0xffd2aa58cca3a44120aaa42cea2852348a9c2ea6',
  ];
}
