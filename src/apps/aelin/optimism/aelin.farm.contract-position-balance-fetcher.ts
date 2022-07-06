import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory, AelinStaking } from '../contracts';

const appId = AELIN_DEFINITION.id;
const groupId = AELIN_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class OptimismAelinFarmContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory)
    private readonly aelinContractFactory: AelinContractFactory,
  ) { }

  async getBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<AelinStaking>({
      address,
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.aelinContractFactory.aelinStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }
}
