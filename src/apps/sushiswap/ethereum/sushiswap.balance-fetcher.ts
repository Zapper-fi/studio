import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { MasterChefContractPositionBalanceHelper } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-balance-helper';
import { MasterChefDefaultClaimableBalanceStrategy } from '~app-toolkit/helpers/master-chef/master-chef.default.claimable-token-balances-strategy';
import { MasterChefDefaultStakedBalanceStrategy } from '~app-toolkit/helpers/master-chef/master-chef.default.staked-token-balance-strategy';
import { MasterChefRewarderClaimableBalanceStrategy } from '~app-toolkit/helpers/master-chef/master-chef.rewarder.claimable-token-balances-strategy';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { UniswapV2TheGraphPoolTokenBalanceHelper } from '~apps/uniswap-v2/helpers/uniswap-v2.the-graph.pool-token-balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SushiSwapChef, SushiSwapChefV2, SushiswapContractFactory, SushiSwapRewarder } from '../contracts';
import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumSushiswapBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SushiswapContractFactory) private readonly contractFactory: SushiswapContractFactory,
    @Inject(UniswapV2TheGraphPoolTokenBalanceHelper)
    private readonly uniswapV2TheGraphPoolTokenBalanceHelper: UniswapV2TheGraphPoolTokenBalanceHelper,
    @Inject(MasterChefContractPositionBalanceHelper)
    private readonly masterChefContractPositionBalanceHelper: MasterChefContractPositionBalanceHelper,
    @Inject(MasterChefDefaultStakedBalanceStrategy)
    private readonly masterChefDefaultStakedBalanceStrategy: MasterChefDefaultStakedBalanceStrategy,
    @Inject(MasterChefDefaultClaimableBalanceStrategy)
    private readonly masterChefDefaultClaimableBalanceStrategy: MasterChefDefaultClaimableBalanceStrategy,
    @Inject(MasterChefRewarderClaimableBalanceStrategy)
    private readonly masterChefRewarderClaimableBalanceStrategy: MasterChefRewarderClaimableBalanceStrategy,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.uniswapV2TheGraphPoolTokenBalanceHelper.getBalances({
      address,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.pool.id,
      network,
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork',
      symbolPrefix: 'SLP',
      overrideDecimalsForTokens: ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'],
    });
  }

  private async getChefV1FarmBalances(address: string) {
    return this.masterChefContractPositionBalanceHelper.getBalances<SushiSwapChef>({
      address,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.chefV1Farm.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.sushiSwapChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingSushi(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getChefV2FarmBalances(address: string) {
    return this.masterChefContractPositionBalanceHelper.getBalances<SushiSwapChefV2>({
      address,
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.chefV2Farm.id,
      network,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.sushiSwapChefV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.masterChefRewarderClaimableBalanceStrategy.build<
        SushiSwapChefV2,
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

  async getBalances(address: string) {
    const [poolTokenBalances, chefV1FarmBalances, chefV2FarmBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getChefV1FarmBalances(address),
      this.getChefV2FarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Farms',
        assets: [...chefV1FarmBalances, ...chefV2FarmBalances],
      },
    ]);
  }
}
