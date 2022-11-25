import { BigNumber } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { Previewer } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';
import { ExactlyTemplateTokenFetcher } from '../helpers/exactly.template.token-fetcher';

const appId = EXACTLY_DEFINITION.id;
const groupId = EXACTLY_DEFINITION.groups.fixedBorrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumExactlyFixedBorrowTokenFetcher extends ExactlyTemplateTokenFetcher {
  network = network;
  groupLabel = 'Fixed borrow';
  isDebt = true;

  getAPR(marketData: Previewer.MarketAccountStructOutput): BigNumber {
    const { minBorrowRate: bestRate } = marketData.fixedPools.reduce((prev, current) =>
      prev.minBorrowRate.lt(current.minBorrowRate) ? prev : current,
    );
    return bestRate;
  }
}
