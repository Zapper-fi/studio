import 'moment-duration-format';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KeeperJobContractPositionFetcher } from '../common/keeper.job.contract-position-fetcher';

@PositionTemplate()
export class EthereumKeeperJobContractPositionFetcher extends KeeperJobContractPositionFetcher {
  groupLabel = 'Keeper Job';
}
