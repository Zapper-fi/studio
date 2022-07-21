import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceBalanceHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(STARGATE_FINANCE_DEFINITION.id, network)
export class EthereumStargateFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(StargateFinanceBalanceHelper) private readonly helper: StargateFinanceBalanceHelper) {}

  async getBalances(address: string) {
    return this.helper.getBalances({ network, address });
  }
}
