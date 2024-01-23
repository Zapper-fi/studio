import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RaftDebtTokenFetcher } from '../common/raft.debt.token-fetcher';

@PositionTemplate()
export class EthereumRaftDebtV1TokenFetcher extends RaftDebtTokenFetcher {
  groupLabel = 'Debt V1';

  collateral = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'; // Wsteth
  stablecoin = '0x183015a9ba6ff60230fdeadc3f43b3d788b13e21'; // R-Stablecoin

  positionManagerAddress = '0x5f59b322eb3e16a0c78846195af1f588b77403fc';
}
