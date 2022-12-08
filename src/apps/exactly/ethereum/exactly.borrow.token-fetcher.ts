import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { Previewer } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';
import { ExactlyTemplateTokenFetcher } from '../helpers/exactly.template.token-fetcher';

const appId = EXACTLY_DEFINITION.id;
const groupId = EXACTLY_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumExactlyBorrowTokenFetcher extends ExactlyTemplateTokenFetcher {
  network = network;
  groupLabel = 'Variable Borrow';
  isDebt = true;

  getAPR(_: Previewer.MarketAccountStructOutput) {
    // not implemented yet
    return 0;
  }
}
