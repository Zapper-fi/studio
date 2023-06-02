import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumRaftDebtTokenFetcher } from './common/raft.debt.token-fetcher';

@PositionTemplate()
export class EthereumRaftWstethDebtTokenFetcher extends EthereumRaftDebtTokenFetcher {
  groupLabel = 'Wsteth Debt'
  collateral = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0' // Wsteth
}
