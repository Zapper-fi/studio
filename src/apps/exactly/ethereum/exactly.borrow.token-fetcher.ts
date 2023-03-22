import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ExactlyBorrowFetcher } from '../common/exactly.borrow.token-fetcher';

@PositionTemplate()
export class EthereumExactlyBorrowFetcher extends ExactlyBorrowFetcher {}
