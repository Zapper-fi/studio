import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxFarmContractPositionFetcher } from '../common/gmx.farm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGmxFarmContractPositionFetcher extends GmxFarmContractPositionFetcher {
  groupLabel = 'Farms';
  farms = [
    {
      address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
      stakedTokenAddress: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a', // GMX
      rewardTokenAddresses: [
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
      ],
      rewardTrackerAddresses: [
        '0xd2d1162512f927a7e282ef43a362659e4f2a728f',
        '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
      ],
    },
    {
      address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
      stakedTokenAddress: '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca', // esGMX
      rewardTokenAddresses: [
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
      ],
      rewardTrackerAddresses: [],
    },
    {
      address: '0x4e971a87900b931ff39d1aad67697f49835400b6',
      stakedTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258', // GLP
      rewardTokenAddresses: [
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
      ],
      rewardTrackerAddresses: [
        '0x4e971a87900b931ff39d1aad67697f49835400b6',
        '0x1addd80e6039594ee970e5872d247bf0414c8903',
      ],
    },
  ];
}
