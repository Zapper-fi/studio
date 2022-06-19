import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TokenBalanceHelper } from '~app-toolkit/helpers/balance/token-balance.helper';
import { MasterChefContractPositionBalanceHelper } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-balance-helper';
import { MasterChefDefaultStakedBalanceStrategy } from '~app-toolkit/helpers/master-chef/master-chef.default.staked-token-balance-strategy';
import { MasterChefRewarderClaimableBalanceStrategy } from '~app-toolkit/helpers/master-chef/master-chef.rewarder.claimable-token-balances-strategy';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SushiswapContractFactory, SushiSwapMiniChef, SushiSwapRewarder } from '../contracts';
import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const network = Network.GNOSIS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class GnosisSushiswapBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SushiswapContractFactory) private readonly contractFactory: SushiswapContractFactory,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(MasterChefContractPositionBalanceHelper)
    private readonly masterChefContractPositionBalanceHelper: MasterChefContractPositionBalanceHelper,
    @Inject(MasterChefDefaultStakedBalanceStrategy)
    private readonly masterChefDefaultStakedBalanceStrategy: MasterChefDefaultStakedBalanceStrategy,
    @Inject(MasterChefRewarderClaimableBalanceStrategy)
    private readonly masterChefRewarderClaimableBalanceStrategy: MasterChefRewarderClaimableBalanceStrategy,
  ) {}

  private async getFarmBalances(address: string) {
    return this.masterChefContractPositionBalanceHelper.getBalances<SushiSwapMiniChef>({
      address,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.chefV2Farm.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.sushiSwapMiniChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.masterChefRewarderClaimableBalanceStrategy.build<
        SushiSwapMiniChef,
        SushiSwapRewarder
      >({
        resolvePrimaryClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingSushi(contractPosition.dataProps.poolIndex, address),
        resolveRewarderAddress: ({ contract, contractPosition, multicall }) =>
          multicall.wrap(contract).rewarder(contractPosition.dataProps.poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.sushiSwapRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableBalance: ({ multicall, rewarderContract, contractPosition, address }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
            .then(v => v.rewardAmounts[0]),
      }),
    });
  }

  private async getPoolTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      network,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.pool.id,
      address,
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
