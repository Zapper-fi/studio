import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LlamapayStreamContractPositionFetcher } from '../common/llamapay.stream.contract-position-fetcher';

@PositionTemplate()
export class OptimismLlamapayStreamContractPositionFetcher extends LlamapayStreamContractPositionFetcher {
  subgraph = 'optimism';
}
