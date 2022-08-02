import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { UmamiFinanceContractFactory } from '../contracts';
import { UMAMI_FINANCE_DEFINITION } from '../umami-finance.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(UMAMI_FINANCE_DEFINITION.id, network)
export class ArbitrumUmamiFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceContractFactory) private readonly contractFactory: UmamiFinanceContractFactory,
  ) {}

  async getMarinatedBalance(address: string) {
    const WETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
    const M_UMAMI_ADDRESS = '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4';
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: UMAMI_FINANCE_DEFINITION.id,
      groupId: UMAMI_FINANCE_DEFINITION.groups.marinate.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(item => item.address === M_UMAMI_ADDRESS)!;
        const rewardToken = contractPosition.tokens.find(item => item.address === WETH_ADDRESS)!;
        const contract = this.contractFactory.umamiFinanceMarinate(contractPosition);
        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).getAvailableTokenRewards(address, WETH_ADDRESS),
        ]);
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(rewardToken, rewardBalanceRaw.toString()),
        ];
      },
    });
  }

  async getCompoundingBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: UMAMI_FINANCE_DEFINITION.id,
      groupId: UMAMI_FINANCE_DEFINITION.groups.compound.id,
      network,
    });
  }

  async getVaultsBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: UMAMI_FINANCE_DEFINITION.id,
      groupId: UMAMI_FINANCE_DEFINITION.groups.vaults.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [mUMAMI, cmUMAMI, vaults] = await Promise.all([
      this.getMarinatedBalance(address),
      this.getCompoundingBalances(address),
      this.getVaultsBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Marinating UMAMI',
        assets: mUMAMI,
      },
      {
        label: 'Compounding Marinating UMAMI',
        assets: cmUMAMI,
      },
      {
        label: 'Vaults',
        assets: vaults,
      },
    ]);
  }
}
