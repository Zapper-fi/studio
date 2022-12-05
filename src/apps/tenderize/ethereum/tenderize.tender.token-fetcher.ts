import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { TenderTokenFetcher } from '../common/tenderize.tender.token-fetcher';

@PositionTemplate()
export class EthereumTenderizeTenderTokenFetcher extends TenderTokenFetcher {
  groupLabel = 'Tender';
}
