import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LyraAvalonStkLyraClaimableContractPositionFetcher } from '../common/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';

@PositionTemplate()
export class OptimismLyraAvalonStkLyraClaimableContractPositionFetcher extends LyraAvalonStkLyraClaimableContractPositionFetcher {
  groupLabel = 'stkLYRA Rewards';

  stkLyraContractAddress = '0xde48b1b5853cc63b1d05e507414d3e02831722f8';
}
