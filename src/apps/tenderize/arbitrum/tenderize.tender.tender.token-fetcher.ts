import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { TenderTokenFetcher } from '../common/tenderize.tender.token-fetcher';
import TENDERIZE_DEFINITION from '../tenderize.definition';

@Injectable()
export class ArbitrumTenderizeTenderTokenFetcher extends TenderTokenFetcher {
  appId = TENDERIZE_DEFINITION.id;
  groupId = TENDERIZE_DEFINITION.groups.tender.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Tender';
}
