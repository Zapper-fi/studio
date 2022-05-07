import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isLocked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GroContractFactory, GroLpTokenStaker } from '../contracts';
import { GRO_DEFINITION } from '../gro.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(GRO_DEFINITION.id, network)
export class EthereumGroBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly groContractFactory: GroContractFactory,
  ) {}

  private async getPoolsBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<GroLpTokenStaker>({
      address,
      appId: GRO_DEFINITION.id,
      groupId: GRO_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.groContractFactory.groLpTokenStaker({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.rewardDebt),
      }),
    });
  }

  private async getVestingBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: GRO_DEFINITION.id,
      groupId: GRO_DEFINITION.groups.farm.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const groVestingAddress = '0x748218256AfE0A19a88EBEB2E0C5Ce86d2178360';
        const contract = this.groContractFactory.groVesting({ network, address: groVestingAddress.toLowerCase() });
        const lockedToken = contractPosition.tokens.find(isLocked)!;
        const unlockedToken = contractPosition.tokens.find(isClaimable)!;
        // Resolve the requested address' vested and vesting balance
        const [vestedBalanceRaw, vestingBalanceRaw] = await Promise.all([
          multicall.wrap(contract).vestedBalance(address),
          multicall.wrap(contract).vestingBalance(address),
        ]);
        return [
          drillBalance(unlockedToken, vestedBalanceRaw.toString()),
          drillBalance(lockedToken, vestingBalanceRaw.toString()),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [poolsBalances, vestingBalances] = await Promise.all([
      this.getPoolsBalances(address),
      this.getVestingBalances(address),
    ]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolsBalances,
      },
      {
        label: 'Vesting',
        assets: vestingBalances,
      },
    ]);
  }
}
