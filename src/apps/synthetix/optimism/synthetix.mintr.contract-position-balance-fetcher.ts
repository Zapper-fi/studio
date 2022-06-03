import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionBalanceHelper } from '../helpers/synthetix.mintr.contract-position-balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.ContractPositionBalanceFetcher({
  appId: SYNTHETIX_DEFINITION.id,
  groupId: SYNTHETIX_DEFINITION.groups.mintr.id,
  network: Network.OPTIMISM_MAINNET,
})
export class OptimismSynthetixMintrContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(SynthetixMintrContractPositionBalanceHelper)
    private readonly synthetixMintrContractPositionBalanceHelper: SynthetixMintrContractPositionBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.synthetixMintrContractPositionBalanceHelper.getBalances({ address, network: Network.OPTIMISM_MAINNET });
  }
}
