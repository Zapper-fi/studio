import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LyraAvalonPoolTokenFetcher } from '../common/lyra-avalon.pool.token-fetcher';

@PositionTemplate()
export class OptimismLyraAvalonPoolTokenFetcher extends LyraAvalonPoolTokenFetcher {
  subgraphUrl = 'https://subgraph.satsuma-prod.com/sw9vuxiQey3c/lyra/optimism-mainnet-newport/api';

  registryContractAddress = '0x0fed189bcd4a680e05b153dc7c3dc87004e162fb';
  underlyingContractAddress = '0x7f5c764cbc14f9669b88837ca1490cca17c31607';
}
