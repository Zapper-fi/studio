import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixTransferrableSnxTokenFetcher } from '../common/synthetix.transferable-snx.token-fetcher';

@PositionTemplate()
export class OptimismSynthetixTransferableSnxTokenFetcher extends SynthetixTransferrableSnxTokenFetcher {
  isExcludedFromTvl = true;
  isExchangeable = true;
  snxAddress = '0x8700daec35af8ff88c16bdf0418774cb3d7599b4';
  groupLabel = 'Transferable SNX';
}
