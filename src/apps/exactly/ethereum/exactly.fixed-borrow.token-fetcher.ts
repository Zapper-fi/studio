import { constants } from 'ethers';

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
  groupLabel = 'Fixed Borrow';
  isDebt = true;

  getAPR({ fixedPools }: Previewer.MarketAccountStructOutput) {
    const rate = fixedPools.reduce(
      (best, { minBorrowRate }) => (minBorrowRate.lt(best) ? minBorrowRate : best),
      constants.MaxUint256,
    );
    return Number(rate) / 1e18;
  }

  getAPY({ fixedPools }: Previewer.MarketAccountStructOutput) {
    const { maturity, rate } = fixedPools.reduce(
      (best, { maturity, minBorrowRate: rate }) => (rate.lt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.MaxUint256 },
    );
    return this.toAPY(Number(rate) / 1e18, Number(maturity));
  }
}
