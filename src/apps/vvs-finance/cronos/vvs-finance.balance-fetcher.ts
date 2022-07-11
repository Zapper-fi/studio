import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { getXVaultBalances } from '../helpers/get-xvault-balances';

import {
  VvsFinanceContractFactory,
  VvsCraftsman,
  VvsCraftsmanV2,
  VvsVault,
  VvsSmartCraftInitializable,
  VvsBoost,
} from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const appId = VVS_FINANCE_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class CronosVvsFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.pool.id,
    });
  }

  private async getFarmBalances(address: string) {
    // LP and Manual VVS Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<VvsCraftsman>({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.farm.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.vvsCraftsman({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingVVS(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getFarmV2Balances(address: string) {
    // LP and Manual VVS Farms
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<VvsCraftsmanV2>({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.farmV2.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.vvsCraftsmanV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall.wrap(contract).pendingVVS(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getAutoVvsMineBalances(address: string) {
    // Autocompounding VVS Mine
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<VvsVault>({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.autoVvsMine.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.vvsVault({ network, address: contractAddress }),
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

  private async getMineBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<VvsSmartCraftInitializable>({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.mine.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.vvsSmartCraftInitializable({ network, address: contractAddress }),
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

  private async getXvvsBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: VVS_FINANCE_DEFINITION.groups.xvvs.id,
    });
  }

  private async getXvvsVaultBalances(address: string) {
    return getXVaultBalances<VvsBoost>({
      accountAddress: address,
      appToolkit: this.appToolkit,
      network,
      appId,
      groupIds: [VVS_FINANCE_DEFINITION.groups.xvvsVault.id],
      resolveContract: ({ contractAddress, network }) => (
        this.contractFactory.vvsBoost({ network, address: contractAddress })
      ),
      resolveUserInfo: async ({ contract, multicall, accountAddress }) => (
        (await multicall.wrap(contract).getUserInfo(accountAddress))[2]
      ),
      resolveClaimableTokenBalance: ({ contract, multicall, accountAddress }) => (
        multicall.wrap(contract).pendingVVS(accountAddress)
      )
    });
  }

  async getBalances(address: string) {
    const [
      poolBalances,
      farmBalances,
      farmV2Balances,
      autoVvsMineBalances,
      mineBalances,
      xvvsBalances,
      xvvsVaultBalances,
    ] = await Promise.all([
      this.getPoolBalances(address),
      this.getFarmBalances(address),
      this.getFarmV2Balances(address),
      this.getAutoVvsMineBalances(address),
      this.getMineBalances(address),
      this.getXvvsBalances(address),
      this.getXvvsVaultBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'FarmsV2',
        assets: farmV2Balances,
      },
      {
        label: 'Auto VVS Mine',
        assets: autoVvsMineBalances,
      },
      {
        label: 'Mines',
        assets: mineBalances,
      },
      {
        label: 'xVVS',
        assets: xvvsBalances,
      },
      {
        label: 'xVVS Vaults',
        assets: xvvsVaultBalances,
      },
    ]);
  }
}
