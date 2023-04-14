import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DefiedgeFarmingContractPositionFetcher } from '../common/defiedge.farming.contract-position-fetcher';

@PositionTemplate()
export class PolygonDefiedgeFarmingContractPositionFetcher extends DefiedgeFarmingContractPositionFetcher {}
