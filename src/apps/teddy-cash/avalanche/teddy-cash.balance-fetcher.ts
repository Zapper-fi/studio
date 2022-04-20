import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { LiquityContractFactory, LiquityStaking } from '~apps/liquity/contracts';
import { LiquityStabilityPoolBalanceHelper } from '~apps/liquity/helpers/liquity.stability-pool.balance-helper';
import { LiquityTroveBalanceHelper } from '~apps/liquity/helpers/liquity.trove.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TEDDY_CASH_DEFINITION } from '../teddy-cash.definition';

const troveManagerAddress = '0xd22b04395705144fd12affd854248427a2776194';
const stabilityPoolAddress = '0x7aed63385c03dc8ed2133f705bbb63e8ea607522';
const stakingAddress = '0xb4387d93b5a9392f64963cd44389e7d9d2e1053c';
const collateralTokenSymbol = 'AVAX';
const debtTokenSymbol = 'TSD';
const govTokenSymbol = 'TEDDY';

const appId = TEDDY_CASH_DEFINITION.id;
const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(appId, network)
export class AvalancheTeddyCashBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LiquityContractFactory)
    private readonly liquityContractFactory: LiquityContractFactory,
    @Inject(LiquityTroveBalanceHelper) private readonly liquityTroveBalanceHelper: LiquityTroveBalanceHelper,
    @Inject(LiquityStabilityPoolBalanceHelper)
    private readonly liquityStabilityPoolBalanceHelper: LiquityStabilityPoolBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const [troveBalances, stabilityPoolBalances, stakedBalances] = await Promise.all([
      this.liquityTroveBalanceHelper.getTroveBalances({
        address,
        appId,
        groupId: TEDDY_CASH_DEFINITION.groups.trove.id,
        network,
        troveManagerAddress: troveManagerAddress,
        collateralTokenSymbol: collateralTokenSymbol,
        debtTokenSymbol: debtTokenSymbol,
      }),
      this.liquityStabilityPoolBalanceHelper.getStabilityPoolBalances({
        address,
        appId,
        groupId: TEDDY_CASH_DEFINITION.groups.stabilityPool.id,
        network,
        stabilityPoolAddress: stabilityPoolAddress,
        collateralTokenSymbol: collateralTokenSymbol,
        debtTokenSymbol: debtTokenSymbol,
        govTokenSymbol: govTokenSymbol,
      }),
      this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<LiquityStaking>({
        address,
        appId,
        groupId: TEDDY_CASH_DEFINITION.groups.farm.id,
        network,
        resolveContract: ({ network }) =>
          this.liquityContractFactory.liquityStaking({ address: stakingAddress, network }),
        resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).stakes(address),
        resolveRewardTokenBalances: ({ contract, address, multicall }) =>
          Promise.all([
            multicall.wrap(contract).getPendingLUSDGain(address),
            multicall.wrap(contract).getPendingETHGain(address),
          ]),
      }),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Trove',
        assets: troveBalances,
      },
      {
        label: 'Stability Pool',
        assets: stabilityPoolBalances,
      },
      {
        label: 'Staked',
        assets: stakedBalances,
      },
    ]);
  }
}
