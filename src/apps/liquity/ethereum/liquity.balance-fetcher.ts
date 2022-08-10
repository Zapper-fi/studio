import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LiquityContractFactory, LiquityStaking } from '../contracts';
import { LiquityStabilityPoolBalanceHelper } from '../helpers/liquity.stability-pool.balance-helper';
import { LiquityTroveBalanceHelper } from '../helpers/liquity.trove.balance-helper';
import { LIQUITY_DEFINITION } from '../liquity.definition';

const troveManagerAddress = '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2';
const stabilityPoolAddress = '0x66017d22b0f8556afdd19fc67041899eb65a21bb';
const stakingAddress = '0x4f9fbb3f1e99b56e0fe2892e623ed36a76fc605d';
const collateralTokenSymbol = 'ETH';
const debtTokenSymbol = 'LUSD';
const govTokenSymbol = 'LQTY';

const appId = LIQUITY_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumLiquityBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(LiquityContractFactory)
    private readonly liquityContractFactory: LiquityContractFactory,
    @Inject(LiquityTroveBalanceHelper) private readonly liquityTroveBalanceHelper: LiquityTroveBalanceHelper,
    @Inject(LiquityStabilityPoolBalanceHelper)
    private readonly liquityStabilityPoolBalanceHelper: LiquityStabilityPoolBalanceHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getBalances(address: string) {
    const [troveBalances, stabilityPoolBalances, stakedBalances] = await Promise.all([
      this.liquityTroveBalanceHelper.getTroveBalances({
        address,
        appId,
        groupId: LIQUITY_DEFINITION.groups.trove.id,
        network,
        troveManagerAddress: troveManagerAddress,
        collateralTokenSymbol: collateralTokenSymbol,
        debtTokenSymbol: debtTokenSymbol,
      }),
      this.liquityStabilityPoolBalanceHelper.getStabilityPoolBalances({
        address,
        appId,
        groupId: LIQUITY_DEFINITION.groups.stabilityPool.id,
        network,
        stabilityPoolAddress: stabilityPoolAddress,
        collateralTokenSymbol: collateralTokenSymbol,
        debtTokenSymbol: debtTokenSymbol,
        govTokenSymbol: govTokenSymbol,
      }),
      this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<LiquityStaking>({
        address,
        appId,
        groupId: LIQUITY_DEFINITION.groups.staking.id,
        network,
        resolveContract: () =>
          this.liquityContractFactory.liquityStaking({
            address: stakingAddress,
            network,
          }),
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
