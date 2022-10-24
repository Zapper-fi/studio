import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { HelioJar } from '../contracts';
import { HELIO_DEFINITION } from '../helio.definition';

import { HelioContractFactory } from './../contracts/index';

const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.BalanceFetcher(HELIO_DEFINITION.id, network)
export class BinanceSmartChainHelioBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HelioContractFactory) private readonly helioContractFactory: HelioContractFactory,
  ) {}

  private async getStakingBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<HelioJar>({
      address,
      appId: HELIO_DEFINITION.id,
      groupId: HELIO_DEFINITION.groups.staking.id,
      network,
      resolveContract: ({ address, network }) => this.helioContractFactory.helioJar({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  async getBalances(address: string) {
    const [stakingBalances] = await Promise.all([this.getStakingBalances(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: stakingBalances,
      },
    ]);
  }
}
