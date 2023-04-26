import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KeeperBondContractPositionFetcher } from '../common/keeper.keeper-bond.contract-position-fetcher';

@PositionTemplate()
export class EthereumKeeperBondContractPositionFetcher extends KeeperBondContractPositionFetcher {
  groupLabel = 'Keep3r Bonds';
}
