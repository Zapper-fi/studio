import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SaddleContractFactory, SaddleMiniChefV2 } from '../contracts';
import { SADDLE_DEFINITION } from '../saddle.definition';

@Register.BalanceFetcher(SADDLE_DEFINITION.id, Network.EVMOS_MAINNET)
export class EvmosSaddleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SaddleContractFactory) private readonly contractFactory: SaddleContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: SADDLE_DEFINITION.id,
      groupId: SADDLE_DEFINITION.groups.pool.id,
      network: Network.EVMOS_MAINNET,
    });
  }

  private async getMiniChefV2FarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<SaddleMiniChefV2>({
      address,
      appId: SADDLE_DEFINITION.id,
      groupId: SADDLE_DEFINITION.groups.miniChefV2.id,
      network: Network.EVMOS_MAINNET,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.saddleMiniChefV2({ network: Network.EVMOS_MAINNET, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .pendingSaddle(contractPosition.dataProps.poolIndex, address);

        const claimableToken = contractPosition.tokens.find(t => t.metaType === MetaType.CLAIMABLE)!;
        return [drillBalance(claimableToken, pendingTokens.toString())];
      },
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, miniChefV2FarmBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getMiniChefV2FarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Farms',
        assets: miniChefV2FarmBalances,
      },
    ]);
  }
}
