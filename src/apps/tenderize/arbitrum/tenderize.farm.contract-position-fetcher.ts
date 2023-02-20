import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { FarmContractPositionFetcher } from '../common/tenderize.farm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumTenderizeFarmTokenFetcher extends FarmContractPositionFetcher {
  groupLabel = 'Farm';
}
