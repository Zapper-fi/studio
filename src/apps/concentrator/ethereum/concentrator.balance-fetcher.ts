import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { isSupplied } from '~position/position.utils';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(CONCENTRATOR_DEFINITION.id, network)
export class EthereumConcentratorBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) { }

  async getTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: CONCENTRATOR_DEFINITION.id,
      groupId: CONCENTRATOR_DEFINITION.groups.acrv.id,
      network: Network.ETHEREUM_MAINNET,
    })
  }

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: CONCENTRATOR_DEFINITION.id,
      groupId: CONCENTRATOR_DEFINITION.groups.pool.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;

        const contract = this.concentratorContractFactory.aladdinConvexVault(contractPosition);
        const pid = contractPosition.dataProps.poolIndex;
        const [userInfo, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).userInfo(pid, address),
          multicall.wrap(contract).pendingReward(pid, address),
        ])

        return [
          drillBalance(stakedToken, userInfo[0].toString())
          // TODO: add rewards
        ]
      },
    });
  }

  async getBalances(address: string) {
    const [aCrvTokenBalances, poolBalances] = await Promise.all([
      this.getTokenBalances(address),
      this.getPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'aCrv',
        assets: aCrvTokenBalances,
      },
      {
        label: 'Pools',
        assets: poolBalances,
      }
    ]);
  }
}