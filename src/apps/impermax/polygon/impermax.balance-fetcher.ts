import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ImpermaxBalanceHelper } from '../helpers/impermax.balance-helper';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(IMPERMAX_DEFINITION.id, network)
export class PolygonImpermaxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(ImpermaxBalanceHelper)
    private readonly impermaxBalanceHelper: ImpermaxBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.impermaxBalanceHelper.getBalances({ address, network });
  }
}
