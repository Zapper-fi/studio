import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapKashiLeverageContractPositionFetcher } from '../common/sushiswap-kashi.leverage.contract-position-fetcher';

@PositionTemplate()
export class PolygonSushiswapKashiLeverageContractPositionFetcher extends SushiswapKashiLeverageContractPositionFetcher {
  groupLabel = 'Lending';
}
