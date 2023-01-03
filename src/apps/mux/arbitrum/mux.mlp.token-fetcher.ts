import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class ArbitrumMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = '0x7cbaf5a14d953ff896e5b3312031515c858737c8';
  poolAddress = '0x3e0199792ce69dc29a0a36146bfa68bd7c8d6633';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/mux-world/mux-arb';
}
