import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GRAPH_URL, MUXLP_ADDRESS, POOL_ADDRESS } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class FantomMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = MUXLP_ADDRESS[Network.FANTOM_OPERA_MAINNET];
  poolAddress = POOL_ADDRESS[Network.FANTOM_OPERA_MAINNET];
  subgraphUrl = GRAPH_URL[Network.FANTOM_OPERA_MAINNET];
}
