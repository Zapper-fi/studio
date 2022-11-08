import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixSynthTokenFetcher } from '../common/synthetix.synth.token-fetcher';

@PositionTemplate()
export class EthereumSynthetixSynthTokenFetcher extends SynthetixSynthTokenFetcher {
  groupLabel = 'Synths';
  isExchangeable = true;
  resolverAddress = '0x823be81bbf96bec0e25ca13170f5aacb5b79ba83';
  sUSDAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
}
