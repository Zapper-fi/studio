import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapKashiLendingTokenFetcher } from '../common/sushiswap-kashi.lending.token-fetcher';

@PositionTemplate()
export class PolygonSushiswapKashiLendingTokenFetcher extends SushiswapKashiLendingTokenFetcher {
  groupLabel = 'Lending';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/matthewlilley/kashi-polygon?source=zapper';
}
