import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  BadgerClaimableContractPositionFetcher,
  BadgerClaimableDefinition,
} from '../common/badger.claimable.contract-position-fetcher';

@PositionTemplate()
export class PolygonBadgerClaimableContractPositionFetcher extends BadgerClaimableContractPositionFetcher {
  groupLabel = 'Rewards';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  async getDefinitions(): Promise<BadgerClaimableDefinition[]> {
    return [
      {
        address: '0x2c798fafd37c7dcdcac2498e19432898bc51376b',
        rewardTokenAddress: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
      },
      {
        address: '0x2c798fafd37c7dcdcac2498e19432898bc51376b',
        rewardTokenAddress: '0x172370d5cd63279efa6d502dab29171933a610af',
      },
    ];
  }
}
