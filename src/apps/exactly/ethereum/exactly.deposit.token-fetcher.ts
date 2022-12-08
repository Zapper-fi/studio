import { Register } from '~app-toolkit/decorators';
import type { GetTokenPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';

const group = EXACTLY_DEFINITION.groups.deposit;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId: EXACTLY_DEFINITION.id, groupId: group.id, network })
export class EthereumExactlyDepositTokenFetcher extends ExactlyTokenFetcher {
  groupLabel = group.label;
  groupId = group.id;
  network = network;

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingDepositShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingDepositAssets;
  }
}
