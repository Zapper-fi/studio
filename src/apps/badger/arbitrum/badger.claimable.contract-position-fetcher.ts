import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  BadgerClaimableContractPositionFetcher,
  BadgerClaimableDefinition,
} from '../common/badger.claimable.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumBadgerClaimableContractPositionFetcher extends BadgerClaimableContractPositionFetcher {
  groupLabel = 'Rewards';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  async getDefinitions(): Promise<BadgerClaimableDefinition[]> {
    return [
      {
        address: '0x635eb2c39c75954bb53ebc011bdc6afaace115a6',
        rewardTokenAddress: '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
      },
      {
        address: '0x635eb2c39c75954bb53ebc011bdc6afaace115a6',
        rewardTokenAddress: '0xbfa641051ba0a0ad1b0acf549a89536a0d76472e',
      },
      {
        address: '0x635eb2c39c75954bb53ebc011bdc6afaace115a6',
        rewardTokenAddress: '0x0c2153e8ae4db8233c61717cdc4c75630e952561',
      },
      {
        address: '0x635eb2c39c75954bb53ebc011bdc6afaace115a6',
        rewardTokenAddress: '0xe774d1fb3133b037aa17d39165b8f45f444f632d',
      },
    ];
  }
}
