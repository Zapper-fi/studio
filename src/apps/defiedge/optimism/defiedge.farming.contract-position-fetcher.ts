import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DefiedgeFarmingContractPositionFetcher } from '../common/defiedge.farming.contract-position-fetcher';

@PositionTemplate()
export class OptimismDefiedgeFarmingContractPositionFetcher extends DefiedgeFarmingContractPositionFetcher {}
