import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OGVRewardsBalanceHelper } from '../helpers/ogv-rewards.balance-helper';
import { ORIGIN_DOLLAR_DEFINITION } from '../origin-dollar.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ORIGIN_DOLLAR_DEFINITION.id, network)
export class EthereumOriginDollarBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OGVRewardsBalanceHelper) private readonly rewardsBalanceHelper: OGVRewardsBalanceHelper,
  ) {}

  async getStakeBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ORIGIN_DOLLAR_DEFINITION.id,
      groupId: ORIGIN_DOLLAR_DEFINITION.groups.veogv.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  private async getClaimableBalances(address: string) {
    return this.rewardsBalanceHelper.getClaimableBalances({
      address,
      appId: ORIGIN_DOLLAR_DEFINITION.id,
      groupId: ORIGIN_DOLLAR_DEFINITION.groups.rewards.id,
      network,
    });
  }

  async getWOUSDBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ORIGIN_DOLLAR_DEFINITION.id,
      groupId: ORIGIN_DOLLAR_DEFINITION.groups.wousd.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([
      {
        label: `Wrapped OUSD`,
        assets: await this.getWOUSDBalances(address),
      },
      {
        label: 'OGV Stake',
        assets: await this.getStakeBalances(address),
      },
      {
        label: 'Reward',
        assets: await this.getClaimableBalances(address),
      },
    ]);
  }
}
