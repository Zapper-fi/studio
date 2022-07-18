import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutStaking, SteakHutPool } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(STEAK_HUT_DEFINITION.id, network)
export class AvalancheSteakHutBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) private readonly contractFactory: SteakHutContractFactory,
  ) {}

  private async getTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      groupId: STEAK_HUT_DEFINITION.groups.ve.id,
      network,
      address,
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<SteakHutStaking>({
      appId,
      network,
      address,
      groupId: STEAK_HUT_DEFINITION.groups.staking.id,
      resolveContract: ({ address, network }) => this.contractFactory.steakHutStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .userInfo(address)
          .then(x => x.amount),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).pendingTokens(address),
    });
  }

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<SteakHutPool>({
      address,
      network,
      appId,
      groupId: STEAK_HUT_DEFINITION.groups.pool.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.steakHutPool({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingJoe(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [tokenBalances, stakedBalances, poolBalances] = await Promise.all([
      this.getTokenBalances(address),
      this.getStakedBalances(address),
      this.getPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Tokens',
        assets: tokenBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
      {
        label: 'Pools',
        assets: poolBalances,
      },
    ]);
  }
}
