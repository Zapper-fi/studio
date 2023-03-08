import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ExactlyDepositFetcher } from '../common/exactly.deposit.token-fetcher';

@PositionTemplate()
export class OptimismExactlyDepositFetcher extends ExactlyDepositFetcher {}
