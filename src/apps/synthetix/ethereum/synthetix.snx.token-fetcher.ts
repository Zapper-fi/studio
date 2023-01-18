import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixSnxTokenFetcher } from '../common/synthetix.snx.token-fetcher';

@PositionTemplate()
export class EthereumSynthetixSnxTokenFetcher extends SynthetixSnxTokenFetcher {
  isExcludedFromTvl = true;
  isExchangeable = true;
  snxAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
  groupLabel = 'Transferable SNX';
}
