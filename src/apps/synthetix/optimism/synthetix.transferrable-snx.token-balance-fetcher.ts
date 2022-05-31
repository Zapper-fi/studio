import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixTrasnferrableSnxTokenBalanceHelper } from '../helpers/synthetix.transferrable-snx.token-balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.TokenPositionBalanceFetcher({
  appId: SYNTHETIX_DEFINITION.id,
  groupId: SYNTHETIX_DEFINITION.groups.transferrableSnx.id,
  network: Network.OPTIMISM_MAINNET,
})
export class OptimismSynthetixTransferrableSnxBalanceFetcher
  implements PositionBalanceFetcher<AppTokenPositionBalance>
{
  constructor(
    @Inject(SynthetixTrasnferrableSnxTokenBalanceHelper)
    private readonly tokenBalanceHelper: SynthetixTrasnferrableSnxTokenBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.tokenBalanceHelper.getBalances({ address, network: Network.OPTIMISM_MAINNET });
  }
}
