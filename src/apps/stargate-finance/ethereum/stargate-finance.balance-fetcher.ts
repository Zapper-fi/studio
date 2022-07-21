import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { StargateFinanceContractFactory, StargateFarm } from '../contracts';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const network = Network.ETHEREUM_MAINNET;
const appId = STARGATE_FINANCE_DEFINITION.id;

@Register.BalanceFetcher(STARGATE_FINANCE_DEFINITION.id, network)
export class EthereumStargateFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory) private readonly contractFactory: StargateFinanceContractFactory
  ) { }

  private async getVeBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      groupId: STARGATE_FINANCE_DEFINITION.groups.ve.id,
      network,
      address,
    });
  }

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      groupId: STARGATE_FINANCE_DEFINITION.groups.pool.id,
      network,
      address,
    });
  }

  private async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<StargateFarm>({
      address,
      network,
      appId,
      groupId: STARGATE_FINANCE_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.stargateFarm({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingStargate(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [veBalances, poolBalances, farmBalances] = await Promise.all([
      this.getVeBalances(address),
      this.getPoolBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'VotedEscrow',
        assets: veBalances,
      },
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
