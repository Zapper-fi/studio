import { Inject } from '@nestjs/common';
import { range, sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromeGauge, VelodromeVe } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const network = Network.OPTIMISM_MAINNET;
const appId = VELODROME_DEFINITION.id;

@Register.BalanceFetcher(VELODROME_DEFINITION.id, network)
export class OptimismVelodromeBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) private readonly contractFactory: VelodromeContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: VELODROME_DEFINITION.groups.pool.id,
      network,
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<VelodromeGauge>({
      address,
      appId,
      groupId: VELODROME_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.velodromeGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.earned(v.address, address)));
      },
    });
  }

  private async getLockedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<VelodromeVe>({
      address,
      appId,
      groupId: VELODROME_DEFINITION.groups.votingEscrow.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.velodromeVe({ address, network }),
      resolveStakedTokenBalance: async ({ contract, address, multicall }) => {
        const veCount = Number(await multicall.wrap(contract).balanceOf(address));
        return sum(
          await Promise.all(
            range(veCount).map(async i => {
              const tokenId = await multicall.wrap(contract).tokenOfOwnerByIndex(address, i);
              const balance = await multicall.wrap(contract).balanceOfNFT(tokenId);
              return Number(balance);
            }),
          ),
        );
      },
      resolveRewardTokenBalances: () => 0, // TODO: figure out how this works
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, stakedBalances, lockedBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedBalances(address),
      this.getLockedBalances(address),
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
      {
        label: 'Locked',
        assets: lockedBalances,
      },
    ]);
  }
}
