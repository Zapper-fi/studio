import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { TenderTokenFetcher } from '../common/tenderize.tender.token-fetcher';
import TENDERIZE_DEFINITION from '../tenderize.definition';

const appId = TENDERIZE_DEFINITION.id;
const groupId = TENDERIZE_DEFINITION.groups.tender.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumTenderizeTenderTokenFetcher extends TenderTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Tender';
}
