import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GRAPH_URL, MUXLP_ADDRESS, POOL_ADDRESS } from '~apps/mux/common/constants';
import { Network } from '~types';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = MUXLP_ADDRESS[Network.BINANCE_SMART_CHAIN_MAINNET];
  poolAddress = POOL_ADDRESS[Network.BINANCE_SMART_CHAIN_MAINNET];
  subgraphUrl = GRAPH_URL[Network.BINANCE_SMART_CHAIN_MAINNET];
}
