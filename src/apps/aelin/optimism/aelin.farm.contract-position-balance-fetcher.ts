import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory, AelinStaking } from '../contracts';

@Register.ContractPositionBalanceFetcher({
  appId: AELIN_DEFINITION.id,
  groupId: AELIN_DEFINITION.groups.farm.id,
  network: Network.OPTIMISM_MAINNET,
})
export class OptimismAelinFarmContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory)
    private readonly aelinContractFactory: AelinContractFactory,
  ) {}

  async getBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<AelinStaking>({
      address,
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.farm.id,
      network: Network.OPTIMISM_MAINNET,
      resolveContract: ({ address, network }) => this.aelinContractFactory.aelinStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }
}
