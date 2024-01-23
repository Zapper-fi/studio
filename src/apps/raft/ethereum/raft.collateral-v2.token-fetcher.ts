import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RaftCollateralTokenFetcher } from '../common/raft.collateral.token-fetcher';

@PositionTemplate()
export class EthereumRaftCollateralV2TokenFetcher extends RaftCollateralTokenFetcher {
  groupLabel = 'Collateral V2';

  collateral = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'; // Wsteth
  positionManagerAddress = '0x9ab6b21cdf116f611110b048987e58894786c244';
}
