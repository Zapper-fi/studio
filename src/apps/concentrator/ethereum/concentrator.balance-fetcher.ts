import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory, AladdinConvexVault } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(CONCENTRATOR_DEFINITION.id, network)
export class EthereumConcentratorBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) {}

  async getTokenBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: CONCENTRATOR_DEFINITION.id,
      groupId: CONCENTRATOR_DEFINITION.groups.acrv.id,
      network,
    });
  }

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<AladdinConvexVault>({
      address,
      appId: CONCENTRATOR_DEFINITION.id,
      groupId: CONCENTRATOR_DEFINITION.groups.pool.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.concentratorContractFactory.aladdinConvexVault({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v[0]),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingReward(contractPosition.dataProps.poolIndex, address),
      }),
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
      },
    ]);
  }
}
