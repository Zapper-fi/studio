import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXContractFactory, BeethovenXMasterchef } from '../contracts';

const appId = BEETHOVEN_X_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class FantomBeethovenXBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) private readonly contractFactory: BeethovenXContractFactory,
  ) {}

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BEETHOVEN_X_DEFINITION.groups.fBeets.id,
    });
  }

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BEETHOVEN_X_DEFINITION.groups.pool.id,
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<BeethovenXMasterchef>({
      address,
      appId,
      groupId: BEETHOVEN_X_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.beethovenXMasterchef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingBeets(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, farmBalances, stakedBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getFarmBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
