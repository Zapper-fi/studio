import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { UmamiContractFactory } from '../contracts';
import { UMAMI_DEFINITION } from '../umami.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(UMAMI_DEFINITION.id, network)
export class ArbitrumUmamiBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiContractFactory) private readonly umamiContractFactory: UmamiContractFactory,
  ) {}

  async getMarinatedBalance(address: string) {
    const wETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
    const mUMAMI_ADDRESS = '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4';
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: UMAMI_DEFINITION.id,
      groupId: UMAMI_DEFINITION.groups.marinate.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(item => item.address === mUMAMI_ADDRESS)!;
        const rewardToken = contractPosition.tokens.find(item => item.address === wETH_ADDRESS)!;
        const contract = this.umamiContractFactory.umamiMarinate(contractPosition);
        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).getAvailableTokenRewards(address, wETH_ADDRESS),
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
      appId: UMAMI_DEFINITION.id,
      groupId: UMAMI_DEFINITION.groups.compound.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [mUMAMI, cmUMAMI] = await Promise.all([
      this.getMarinatedBalance(address),
      this.getCompoundingBalances(address),
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
    ]);
  }
}
