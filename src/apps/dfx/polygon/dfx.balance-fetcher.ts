import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { DfxContractFactory } from '../contracts';
import { DFX_DEFINITION } from '../dfx.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(DFX_DEFINITION.id, network)
export class PolygonDfxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DfxContractFactory) private readonly dfxContractFactory: DfxContractFactory,
  ) {}

  async getCurveTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: DFX_DEFINITION.id,
      groupId: DFX_DEFINITION.groups.curve.id,
      network,
    });
  }

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: DFX_DEFINITION.id,
      groupId: DFX_DEFINITION.groups.staking.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve staked token and reward token balances from contract position object
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        const contract = this.dfxContractFactory.dfxStaking(contractPosition);

        // Resolve requested address' staked balance and earned balance
        const [stakedBalanceRaw, earnedBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).earned(address),
        ]);

        // Drill balance into token object
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(rewardToken, earnedBalanceRaw.toString()),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [curveTokenBalances, stakedBalances] = await Promise.all([
      this.getCurveTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'DFX Curves',
        assets: curveTokenBalances,
      },
      {
        label: 'DFX Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
