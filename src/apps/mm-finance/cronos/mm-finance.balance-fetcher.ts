import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  MmFinanceMeerkatChef,
  MmFinanceChef,
  MmFinanceChefV2,
  MmFinanceContractFactory,
  MmFinanceIfoChef,
  MmFinanceSmartChef,
  MmFinanceSyrupMeerkat,
} from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

const appId = MM_FINANCE_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class CronosMmFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory) private readonly contractFactory: MmFinanceContractFactory,
  ) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.pool.id,
    });
  }

  private async getLegacyFarmBalances(address: string) {
    // LP and Manual Mmf Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceChef>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceChef({ network, address: contractAddress }),
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
    // LP and Manual Mmf Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceChefV2>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.farmV2.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceChefV2({ network, address: contractAddress }),
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

  private async getIfoMmfBalances(address: string) {
    // IFO Mmf Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceIfoChef>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.ifoMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceIfoChef({ network, address: contractAddress }),
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

  private async getAutoMmfBalances(address: string) {
    // Autocompounding Mmf Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceMeerkatChef>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.autoMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceMeerkatChef({ network, address: contractAddress }),
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

  private async getSyrupMeerkatBalances(address: string) {
    // Autocompounding Mmf Farm
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceSyrupMeerkat>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.syrupMmf.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceSyrupMeerkat({ network, address: contractAddress }),
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
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<MmFinanceSmartChef>({
      address,
      appId,
      network,
      groupId: MM_FINANCE_DEFINITION.groups.syrupStaking.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.mmFinanceSmartChef({ network, address: contractAddress }),
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
      autoMmfBalances,
      syrupMmfBalances,
      ifoMmfBalances,
      syrupPoolBalances,
    ] = await Promise.all([
      this.getPoolBalances(address),
      this.getLegacyFarmBalances(address),
      this.getFarmBalances(address),
      this.getAutoMmfBalances(address),
      this.getSyrupMeerkatBalances(address),
      this.getIfoMmfBalances(address),
      this.getSyrupPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Auto MMF',
        assets: autoMmfBalances,
      },
      {
        label: 'IFO MMF',
        assets: ifoMmfBalances,
      },
      {
        label: 'Staked MMF',
        assets: syrupMmfBalances,
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
