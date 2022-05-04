import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  PancakeswapCakeChef,
  PancakeswapChef,
  PancakeswapContractFactory,
  PancakeswapIfoChef,
  PancakeswapSmartChef,
} from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const appId = PANCAKESWAP_DEFINITION.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.BalanceFetcher(appId, network)
export class BinanceSmartChainPancakeSwapBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory)
    private readonly contractFactory: PancakeswapContractFactory,
  ) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: PANCAKESWAP_DEFINITION.groups.pool.id,
    });
  }

  private async getFarmBalances(address: string) {
    // LP and Manual Cake Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PancakeswapChef>({
      address,
      appId,
      network,
      groupId: PANCAKESWAP_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.pancakeswapChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingCake(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getIfoCakeBalances(address: string) {
    // IFO Cake Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PancakeswapIfoChef>({
      address,
      appId,
      network,
      groupId: PANCAKESWAP_DEFINITION.groups.ifoCake.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.pancakeswapIfoChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ multicall, contract }) => {
          const [userInfo, pricePerShareRaw] = await Promise.all([
            multicall.wrap(contract).userInfo(address),
            multicall.wrap(contract).getPricePerFullShare(),
          ]);

          const shares = userInfo.shares.toString();
          const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
          return new BigNumber(shares).times(pricePerShare).toFixed(0);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: async () => 0, // Autocompounding
      }),
    });
  }

  private async getAutoCakeBalances(address: string) {
    // Autocompounding Cake Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PancakeswapCakeChef>({
      address,
      appId,
      network,
      groupId: PANCAKESWAP_DEFINITION.groups.autoCake.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.pancakeswapCakeChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ multicall, contract, address }) => {
          const [userInfo, pricePerShareRaw] = await Promise.all([
            multicall.wrap(contract).userInfo(address),
            multicall.wrap(contract).getPricePerFullShare(),
          ]);

          const shares = userInfo.shares.toString();
          const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
          return new BigNumber(shares).times(pricePerShare).toFixed(0);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: async () => 0, // Autocompounding
      }),
    });
  }

  private async getSyrupPoolBalances(address: string) {
    // Syrup Pools (single-staking)
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PancakeswapSmartChef>({
      address,
      appId,
      network,
      groupId: PANCAKESWAP_DEFINITION.groups.syrupStaking.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.pancakeswapSmartChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, address }) =>
          multicall
            .wrap(contract)
            .userInfo(address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, address }) => multicall.wrap(contract).pendingReward(address),
      }),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, farmBalances, autoCakeBalances, ifoCakeBalances, syrupPoolBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getFarmBalances(address),
      this.getAutoCakeBalances(address),
      this.getIfoCakeBalances(address),
      this.getSyrupPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Auto CAKE',
        assets: autoCakeBalances,
      },
      {
        label: 'IFO CAKE',
        assets: ifoCakeBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'Syrup Pools',
        assets: syrupPoolBalances,
      },
    ]);
  }
}
