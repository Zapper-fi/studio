import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { LlamapayVestingEscrowContractPositionFetcher } from '../common/llamapay.vesting-escrow.contract-position-fetcher';

@PositionTemplate()
export class EthereumLlamapayVestingEscrowContractPositionFetcher extends LlamapayVestingEscrowContractPositionFetcher {
  subgraph = 'mainnet';
}
