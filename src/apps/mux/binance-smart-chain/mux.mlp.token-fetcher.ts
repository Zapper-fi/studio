import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = '0x07145ad7c7351c6fe86b6b841fc9bed74eb475a7';
  poolAddress = '0x855e99f768fad76dd0d3eb7c446c0b759c96d520';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/mux-world/mux-bsc';
}
