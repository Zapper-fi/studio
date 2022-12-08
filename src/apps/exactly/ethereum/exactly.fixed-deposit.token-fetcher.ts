import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { Previewer } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';
import { ExactlyTemplateTokenFetcher } from '../helpers/exactly.template.token-fetcher';

const appId = EXACTLY_DEFINITION.id;
const groupId = EXACTLY_DEFINITION.groups.fixedDeposit.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumExactlyFixedDepositTokenFetcher extends ExactlyTemplateTokenFetcher {
  network = network;
  groupLabel = 'Fixed borrow';

  getAPR(marketData: Previewer.MarketAccountStructOutput) {
    const { depositRate: bestRate } = marketData.fixedPools.reduce((prev, current) =>
      prev.depositRate.gt(current.depositRate) ? prev : current,
    );
    return bestRate;
  }
}
