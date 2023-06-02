import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumRaftContractPositionFetcher } from '../common/raft.position.contract-position-fetcher';

@PositionTemplate()
export class EthereumRaftWstethContractPositionFetcher extends EthereumRaftContractPositionFetcher {
  groupLabel = 'Wsteth';

  collateral = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'; // Wsteth
  positionManagerAddress = '0x5f59b322eb3e16a0c78846195af1f588b77403fc';
}
