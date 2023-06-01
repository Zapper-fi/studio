import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumRaftCollateralTokenFetcher } from './common/raft.collateral.token-fetcher';

@PositionTemplate()
export class EthereumRaftWstethCollateralTokenFetcher extends EthereumRaftCollateralTokenFetcher {
  groupLabel = 'Wsteth Collateral'
  collateral = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0' // Wsteth
}
