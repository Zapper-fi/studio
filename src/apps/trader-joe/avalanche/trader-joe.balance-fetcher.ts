import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import {
  TraderJoeChefBoosted,
  TraderJoeChefV2,
  TraderJoeChefV3,
  TraderJoeContractFactory,
  TraderJoeStableStaking,
  TraderJoeVeJoeStaking,
} from '../contracts';
import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

const appId = TRADER_JOE_DEFINITION.id;
const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(TRADER_JOE_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalancheTraderJoeBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) private readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {}

  private async getXJoeBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.xJoe.id,
      network,
      address,
    });
  }

  private async getSJoeBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<TraderJoeStableStaking>({
      address,
      appId,
      network,
      groupId: TRADER_JOE_DEFINITION.groups.sJoe.id,
      resolveContract: opts => this.traderJoeContractFactory.traderJoeStableStaking(opts),
      resolveStakedTokenBalance: ({ multicall, contract, contractPosition }) => {
        const tokenAddress = contractPosition.tokens.find(v => v.metaType === MetaType.CLAIMABLE)?.address;
        if (!tokenAddress) {
          throw new Error(`Could not find claimable token for ${contractPosition.address} ${contractPosition.network}`);
        }
        return multicall
          .wrap(contract)
          .getUserInfo(address, tokenAddress)
          .then(v => v[0]);
      },
      resolveRewardTokenBalances: ({ multicall, contract, contractPosition }) => {
        const tokenAddress = contractPosition.tokens.find(v => v.metaType === MetaType.CLAIMABLE)?.address;
        if (!tokenAddress) {
          throw new Error(`Could not find claimable token for ${contractPosition.address} ${contractPosition.network}`);
        }
        return multicall.wrap(contract).pendingReward(address, tokenAddress);
      },
    });
  }

  private async getVeJoeStakingBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<TraderJoeVeJoeStaking>({
      address,
      appId,
      network,
      groupId: TRADER_JOE_DEFINITION.groups.veJoeFarm.id,
      resolveContract: opts => this.traderJoeContractFactory.traderJoeVeJoeStaking(opts),
      resolveStakedTokenBalance: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .userInfos(address)
          .then(v => v.balance),
      resolveRewardTokenBalances: ({ multicall, contract }) => multicall.wrap(contract).getPendingVeJoe(address),
    });
  }

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.pool.id,
      network,
      address,
    });
  }

  private async getChefV2FarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<TraderJoeChefV2>({
      address,
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.chefV2Farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.traderJoeContractFactory.traderJoeChefV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .pendingTokens(contractPosition.dataProps.poolIndex, address);

        const claimable = [pendingTokens.pendingJoe, pendingTokens.pendingBonusToken];
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, claimable[i].toString()));
      },
    });
  }

  private async getChefV3FarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<TraderJoeChefV3>({
      address,
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.chefV3Farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.traderJoeContractFactory.traderJoeChefV3({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .pendingTokens(contractPosition.dataProps.poolIndex, address);

        const claimable = [pendingTokens.pendingJoe, pendingTokens.pendingBonusToken];
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, claimable[i].toString()));
      },
    });
  }

  private async getChefBoostedFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<TraderJoeChefBoosted>({
      address,
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.chefBoostedFarm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.traderJoeContractFactory.traderJoeChefBoosted({
          network,
          address: contractAddress,
        }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .pendingTokens(contractPosition.dataProps.poolIndex, address);

        const claimable = [pendingTokens.pendingJoe, pendingTokens.pendingBonusToken];
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, claimable[i].toString()));
      },
    });
  }

  async getBalances(address: string) {
    const [
      xJoeBalances,
      sJoeBalances,
      veJoeBalances,
      poolBalances,
      chefV2FarmBalances,
      chefV3FarmBalances,
      chefBoostedFarmBalances,
    ] = await Promise.all([
      this.getXJoeBalances(address),
      this.getSJoeBalances(address),
      this.getVeJoeStakingBalances(address),
      this.getPoolBalances(address),
      this.getChefV2FarmBalances(address),
      this.getChefV3FarmBalances(address),
      this.getChefBoostedFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'xJOE',
        assets: [...xJoeBalances],
      },
      {
        label: 'sJOE',
        assets: [...sJoeBalances],
      },
      {
        label: 'veJOE Staking',
        assets: [...veJoeBalances],
      },
      {
        label: 'Pools',
        assets: [...poolBalances],
      },
      {
        label: 'Farms',
        assets: [...chefV2FarmBalances, ...chefV3FarmBalances],
      },
      {
        label: 'Boost',
        assets: [...chefBoostedFarmBalances],
      },
    ]);
  }
}
