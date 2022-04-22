import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGaugeV2 } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

@Register.BalanceFetcher(CURVE_DEFINITION.id, Network.GNOSIS_MAINNET)
export class GnosisCurveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      network: Network.GNOSIS_MAINNET,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.pool.id,
      address,
    });
  }

  private async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<CurveGaugeV2>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.farm.id,
      network: Network.GNOSIS_MAINNET,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveGaugeV2({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward_write(address, v.address)));
      },
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, stakedBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Staked',
        assets: stakedBalances,
      },
    ]);
  }
}
