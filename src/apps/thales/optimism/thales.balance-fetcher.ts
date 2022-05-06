import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { StakingThales, ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(THALES_DEFINITION.id, network)
export class OptimismThalesBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) {}

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<StakingThales>({
      address,
      appId: THALES_DEFINITION.id,
      groupId: THALES_DEFINITION.groups.staking.id,
      network,
      resolveContract: ({ address, network }) => this.thalesContractFactory.stakingThales({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall.wrap(contract).stakedBalanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) =>
        multicall.wrap(contract).getRewardsAvailable(address),
    });
  }

  async getBalances(address: string) {
    const [stakingBalances] = await Promise.all([this.getStakedBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: stakingBalances,
      },
    ]);
  }
}
