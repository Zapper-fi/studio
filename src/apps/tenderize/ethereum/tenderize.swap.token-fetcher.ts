import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { SwapTokenFetcher } from '../common/tenderize.swap.token-fetcher';
import TENDERIZE_DEFINITION from '../tenderize.definition';

const appId = TENDERIZE_DEFINITION.id;
const groupId = TENDERIZE_DEFINITION.groups.swap.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTenderizeSwapTokenFetcher extends SwapTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Swap';
}
