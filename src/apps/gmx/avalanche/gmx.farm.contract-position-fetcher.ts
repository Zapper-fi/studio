import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxFarmContractPositionFetcher } from '../common/gmx.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheGmxFarmContractPositionFetcher extends GmxFarmContractPositionFetcher {
  groupLabel = 'Farms';
  farms = [
    {
      address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
      stakedTokenAddress: '0x62edc0692bd897d2295872a9ffcac5425011c661', // GMX
      rewardTokenAddresses: [
        '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        '0xff1489227bbaac61a9209a08929e4c2a526ddd17',
      ],
      rewardTrackerAddresses: [
        '0x4d268a7d4c16ceb5a606c173bd974984343fea13',
        '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
      ],
    },
    {
      address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
      stakedTokenAddress: '0xff1489227bbaac61a9209a08929e4c2a526ddd17', // esGMX
      rewardTokenAddresses: [
        '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        '0xff1489227bbaac61a9209a08929e4c2a526ddd17',
      ],
      rewardTrackerAddresses: [],
    },
    {
      address: '0xd2d1162512f927a7e282ef43a362659e4f2a728f',
      stakedTokenAddress: '0x01234181085565ed162a948b6a5e88758cd7c7b8', // GLP
      rewardTokenAddresses: [
        '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        '0xff1489227bbaac61a9209a08929e4c2a526ddd17',
      ],
      rewardTrackerAddresses: [
        '0xd2d1162512f927a7e282ef43a362659e4f2a728f',
        '0x9e295b5b976a184b14ad8cd72413ad846c299660',
      ],
    },
  ];
}
