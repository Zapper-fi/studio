import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory, AelinStaking } from '../contracts';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(AELIN_DEFINITION.id, Network.OPTIMISM_MAINNET)
export class OptimismAelinBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory) private readonly aelinContractFactory: AelinContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.pool.id,
      address,
    });
  }

  private async getVAelinTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.vAelin.id,
      network,
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<AelinStaking>({
      address,
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.aelinContractFactory.aelinStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  async getBalances(address: string) {
    const [vAelinTokenBalances, poolTokenBalances, stakedBalances] = await Promise.all([
      this.getVAelinTokenBalances(address),
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'vAELIN',
        assets: vAelinTokenBalances,
      },
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
