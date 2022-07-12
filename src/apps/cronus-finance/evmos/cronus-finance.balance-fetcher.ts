import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { UniswapV2TheGraphPoolTokenBalanceHelper } from '~apps/uniswap-v2';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CronusFinanceContractFactory } from '../contracts';
import { CRONUS_FINANCE_DEFINITION } from '../cronus-finance.definition';

const network = Network.EVMOS_MAINNET;

@Register.BalanceFetcher(CRONUS_FINANCE_DEFINITION.id, network)
export class EvmosCronusFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CronusFinanceContractFactory) private readonly cronusFinanceContractFactory: CronusFinanceContractFactory,
    @Inject(UniswapV2TheGraphPoolTokenBalanceHelper)
    private readonly uniswapV2TheGraphPoolTokenBalanceHelper: UniswapV2TheGraphPoolTokenBalanceHelper,
  ) {}

  async getPoolTokenBalances(address: string) {
    return this.uniswapV2TheGraphPoolTokenBalanceHelper.getBalances({
      appId: CRONUS_FINANCE_DEFINITION.id,
      groupId: CRONUS_FINANCE_DEFINITION.groups.pool.id,
      network,
      address,
      subgraphUrl: 'https://thegraph.cronusfinancexyz.com/subgraphs/name/exchange',
      symbolPrefix: 'CLP',
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: CRONUS_FINANCE_DEFINITION.id,
      groupId: CRONUS_FINANCE_DEFINITION.groups.farm.id,
      network: Network.EVMOS_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        // Instantiate an Ethers contract instance
        const contract = this.cronusFinanceContractFactory.cronusFinanceFarm(contractPosition);

        // Resolve the requested address' staked balance and earned balance
        const [userInfo, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).userInfo(0, address),
          multicall.wrap(contract).pendingTokens(0, address),
        ]);
        const stakedBalanceRaw = userInfo[4];

        // Drill the balance into the token object. Drill will push the balance into the token tree,
        // thereby showing the user's exposure to underlying tokens of the jar token!
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(rewardToken, rewardBalanceRaw.toString()),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, farmBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
