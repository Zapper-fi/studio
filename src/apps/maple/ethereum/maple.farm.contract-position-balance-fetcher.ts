import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { MapleContractFactory, MapleRewards } from '../contracts';
import { MAPLE_DEFINITION } from '../maple.definition';

@Register.ContractPositionBalanceFetcher({
  appId: MAPLE_DEFINITION.id,
  groupId: MAPLE_DEFINITION.groups.farm.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumMapleFarmContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(MapleContractFactory)
    private readonly mapleContractFactory: MapleContractFactory,
  ) {}

  async getBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MapleRewards>({
      address,
      appId: MAPLE_DEFINITION.id,
      groupId: MAPLE_DEFINITION.groups.farm.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) => this.mapleContractFactory.mapleRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }
}
