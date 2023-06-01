import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KeeperUnbondContractPositionFetcher } from '../common/keeper.keeper-unbond.contract-position-fetcher';

@PositionTemplate()
export class EthereumKeeperUnbondContractPositionFetcher extends KeeperUnbondContractPositionFetcher {
  groupLabel = 'Keep3r Unbonds';
}
