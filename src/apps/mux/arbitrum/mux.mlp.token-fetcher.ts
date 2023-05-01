import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MUXLP_ADDRESS, POOL_ADDRESS, GRAPH_URL } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class ArbitrumMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = MUXLP_ADDRESS[Network.ARBITRUM_MAINNET];
  poolAddress = POOL_ADDRESS[Network.ARBITRUM_MAINNET];
  subgraphUrl = GRAPH_URL[Network.ARBITRUM_MAINNET];
}
