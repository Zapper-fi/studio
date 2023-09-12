import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GRAPH_URL, MUXLP_ADDRESS, POOL_ADDRESS } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class OptimismMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = MUXLP_ADDRESS[Network.OPTIMISM_MAINNET];
  poolAddress = POOL_ADDRESS[Network.OPTIMISM_MAINNET];
  subgraphUrl = GRAPH_URL[Network.OPTIMISM_MAINNET];
}
