import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied, isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LizTestContractFactory } from '../contracts';
import { LIZ_TEST_DEFINITION } from '../liz-test.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(LIZ_TEST_DEFINITION.id, network)
export class EthereumLizTestBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LizTestContractFactory) private readonly lizTestContractFactory: LizTestContractFactory,
  ) {}

  async getJarTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: LIZ_TEST_DEFINITION.id,
      groupId: LIZ_TEST_DEFINITION.groups.jar.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: LIZ_TEST_DEFINITION.id,
      groupId: LIZ_TEST_DEFINITION.groups.jar.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        // Instantiate an Ethers contract instance
        const contract = this.lizTestContractFactory.pickleGauge(contractPosition);

        // Resolve the requested address' staked balance and earned balance
        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).earned(address),
        ]);

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
    const [jarTokenBalances] = await Promise.all([this.getJarTokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Jars',
        assets: jarTokenBalances,
      },
    ]);
  }
}
