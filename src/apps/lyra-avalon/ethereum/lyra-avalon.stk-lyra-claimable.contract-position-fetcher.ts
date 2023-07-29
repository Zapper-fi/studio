import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LyraAvalonStkLyraClaimableContractPositionFetcher } from '../common/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';

@PositionTemplate()
export class EthereumLyraAvalonStkLyraClaimableContractPositionFetcher extends LyraAvalonStkLyraClaimableContractPositionFetcher {
  groupLabel = 'stkLYRA Rewards';

  stkLyraContractAddress = '0xcb9f85730f57732fc899fb158164b9ed60c77d49';
}
