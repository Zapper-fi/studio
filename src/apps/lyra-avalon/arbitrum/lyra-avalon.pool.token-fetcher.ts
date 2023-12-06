import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LyraAvalonPoolTokenFetcher } from '../common/lyra-avalon.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumLyraAvalonPoolTokenFetcher extends LyraAvalonPoolTokenFetcher {
  subgraphUrl = 'https://subgraph.satsuma-prod.com/sw9vuxiQey3c/lyra/arbitrum-mainnet/api';

  registryContractAddress = '0x6c87e4364fd44b0d425adfd0328e56b89b201329';
  underlyingContractAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
}
