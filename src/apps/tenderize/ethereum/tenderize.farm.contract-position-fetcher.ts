import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { FarmContractPositionFetcher } from '../common/tenderize.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumTenderizeFarmTokenFetcher extends FarmContractPositionFetcher {
  groupLabel = 'Farm';
}
