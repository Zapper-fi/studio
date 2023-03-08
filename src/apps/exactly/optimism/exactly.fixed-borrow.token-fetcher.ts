import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ExactlyFixedBorrowFetcher } from '../common/exactly.fixed-borrow.token-fetcher';

@PositionTemplate()
export class OptimismExactlyFixedBorrowFetcher extends ExactlyFixedBorrowFetcher {}
