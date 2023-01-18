import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MetavaultTradeFarmContractPositionFetcher } from '../common/metavault-trade.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonMetavaultTradeFarmContractPositionFetcher extends MetavaultTradeFarmContractPositionFetcher {
  groupLabel = 'Farms';
  readerAddress = '0x398cab94dea3b44861e7ad7efcd23a6a35d57c3a';
  farms = [
    {
      address: '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9',
      stakedTokenAddress: '0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7', // MVX
      rewardTokenAddresses: [
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        '0xd1b2f8dff8437be57430ee98767d512f252ead61',
      ],
      rewardTrackerAddresses: [
        '0xacec858f6397dd227dd4ed5be91a5bb180b8c430',
        '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9',
      ],
    },
    {
      address: '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9',
      stakedTokenAddress: '0xd1b2f8dff8437be57430ee98767d512f252ead61', // esMVX
      rewardTokenAddresses: [
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        '0xd1b2f8dff8437be57430ee98767d512f252ead61',
      ],
      rewardTrackerAddresses: [],
    },
    {
      address: '0xabd6c70c41fdf9261dff15f4eb589b44a37072eb',
      stakedTokenAddress: '0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8', // MVLP
      rewardTokenAddresses: [
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        '0xd1b2f8dff8437be57430ee98767d512f252ead61',
      ],
      rewardTrackerAddresses: [
        '0xabd6c70c41fdf9261dff15f4eb589b44a37072eb',
        '0xa6ca41bbf555074ed4d041c1f4551ef48116d59a',
      ],
    },
  ];
}
