import { constants } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { ExactlyFixedPositionFetcher } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyFixedMarketProps } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';

const group = EXACTLY_DEFINITION.groups.fixedDeposit;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId: EXACTLY_DEFINITION.id, groupId: group.id, network })
export class EthereumExactlyFixedDepositPositionFetcher extends ExactlyFixedPositionFetcher {
  groupLabel = group.label;
  groupId = group.id;
  network = network;

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce((total, { supplied }) => total.add(supplied), constants.Zero);
  }

  getBestRate({ definition }: GetDataPropsParams<Market, ExactlyFixedMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce(
      (best, { maturity, depositRate: rate }) => (rate.gt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.Zero },
    );
  }
}
