import { constants } from 'ethers';

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
  groupLabel = 'Fixed Deposit';

  getAPR({ fixedPools }: Previewer.MarketAccountStructOutput) {
    const rate = fixedPools.reduce(
      (best, { depositRate }) => (depositRate.gt(best) ? depositRate : best),
      constants.Zero,
    );
    return Number(rate) / 1e18;
  }

  getAPY({ fixedPools }: Previewer.MarketAccountStructOutput) {
    const { maturity, rate } = fixedPools.reduce(
      (best, { maturity, depositRate: rate }) => (rate.gt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.Zero },
    );
    return this.toAPY(Number(rate) / 1e18, Number(maturity));
  }
}
