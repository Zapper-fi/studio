import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixSynthTokenFetcher } from '../common/synthetix.synth.token-fetcher';

@PositionTemplate()
export class OptimismSynthetixSynthTokenFetcher extends SynthetixSynthTokenFetcher {
  groupLabel = 'Synths';
  isExchangeable = true;
  resolverAddress = '0x95a6a3f44a70172e7d50a9e28c85dfd712756b8c';
  sUSDAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
}
