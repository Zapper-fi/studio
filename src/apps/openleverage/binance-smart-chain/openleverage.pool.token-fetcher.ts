import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { OpenleveragePoolTokenFetcher } from '../common/openleverage.pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainOpenleveragePoolTokenFetcher extends OpenleveragePoolTokenFetcher {
  groupLabel = 'Pools';

  subgraphUrl = `https://api.thegraph.com/subgraphs/name/openleveragedev/openleverage-bsc?source=zapper`;
}
