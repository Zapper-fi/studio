import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  MmfinanceMeerkatChef,
  MmfinanceChef,
  MmfinanceChefV2,
  MmfinanceContractFactory,
  MmfinanceIfoChef,
  MmfinanceSmartChef,
  MmfinanceSyrupCake,
} from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

const appId = MMFINANCE_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class CronosChainMmfinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmfinanceContractFactory) private readonly contractFactory: MmfinanceContractFactory,
  ) { }

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.pool.id,
    });
  }

  private async getLegacyFarmBalances(address: string) {
    // LP and Manual Cake Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceChef>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingMeerkat(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getFarmBalances(address: string) {
    // LP and Manual Cake Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceChefV2>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.farmV2.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceChefV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingMeerkat(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getIfoCakeBalances(address: string) {
    // IFO Cake Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceIfoChef>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.ifoMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceIfoChef({ network, address: contractAddress }),
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
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceMeerkatChef>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.autoMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceMeerkatChef({ network, address: contractAddress }),
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

  private async getSyrupCakeBalances(address: string) {
    // Autocompounding Cake Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceSyrupCake>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.syrupMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceSyrupCake({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ multicall, contract, address }) => {
          const [userInfo, pricePerShareRaw] = await Promise.all([
            multicall.wrap(contract).userInfo(address),
            multicall.wrap(contract).getPricePerFullShare(),
          ]);

          const shares = userInfo.shares.toString();
          const userBoostedShare = userInfo.userBoostedShare.toString();
          const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
          return new BigNumber(shares).times(pricePerShare).minus(userBoostedShare).toFixed(0);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: async () => 0, // Autocompounding
      }),
    });
  }

  private async getSyrupPoolBalances(address: string) {
    // Syrup Pools (single-staking)
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmfinanceSmartChef>({
      address,
      appId,
      network,
      groupId: MMFINANCE_DEFINITION.groups.syrupStaking.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmfinanceSmartChef({ network, address: contractAddress }),
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
    const [
      poolBalances,
      legacyFarmBalances,
      farmBalances,
      autoCakeBalances,
      syrupCakeBalances,
      ifoCakeBalances,
      syrupPoolBalances,
    ] = await Promise.all([
      this.getPoolBalances(address),
      this.getLegacyFarmBalances(address),
      this.getFarmBalances(address),
      this.getAutoCakeBalances(address),
      this.getSyrupCakeBalances(address),
      this.getIfoCakeBalances(address),
      this.getSyrupPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Auto MMF',
        assets: autoCakeBalances,
      },
      {
        label: 'IFO MMF',
        assets: ifoCakeBalances,
      },
      {
        label: 'Staked MMF',
        assets: syrupCakeBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'Legacy Farms',
        assets: legacyFarmBalances,
      },
      {
        label: 'Syrup Pools',
        assets: syrupPoolBalances,
      },
    ]);
  }
}
