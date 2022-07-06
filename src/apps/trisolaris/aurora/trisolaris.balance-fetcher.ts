import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TrisolarisContractFactory, TrisolarisMasterChef, TrisolarisRewarder } from '../contracts';
import { TRISOLARIS_DEFINITION } from '../trisolaris.definition';

const appId = TRISOLARIS_DEFINITION.id;
const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class AuroraTrisolarisBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TrisolarisContractFactory) private readonly contractFactory: TrisolarisContractFactory,
  ) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: TRISOLARIS_DEFINITION.groups.pool.id,
    });
  }

  private async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<TrisolarisMasterChef>({
      address,
      appId: TRISOLARIS_DEFINITION.id,
      groupId: TRISOLARIS_DEFINITION.groups.farm.id,
      network: Network.AVALANCHE_MAINNET,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.trisolarisMasterChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefV2ClaimableBalanceStrategy.build<
        TrisolarisMasterChef,
        TrisolarisRewarder
      >({
        resolvePrimaryClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingTri(contractPosition.dataProps.poolIndex, address),
        resolveRewarderAddress: ({ contract, contractPosition, multicall }) =>
          multicall.wrap(contract).rewarder(contractPosition.dataProps.poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.trisolarisRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableBalance: ({ multicall, rewarderContract, contractPosition, address }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
            .then(v => v[1][0]),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, farmBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getFarmBalances(address),
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
    ]);
  }
}
