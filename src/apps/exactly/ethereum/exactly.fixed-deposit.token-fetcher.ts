import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ExactlyFixedDepositFetcher } from '../common/exactly.fixed-deposit.token-fetcher';

@PositionTemplate()
export class EthereumExactlyFixedDepositFetcher extends ExactlyFixedDepositFetcher {}
