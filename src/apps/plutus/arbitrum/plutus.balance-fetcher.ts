import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import {
  PlutusContractFactory,
  PlsPlutusChef,
  PlsDpxPlutusChef,
  PlsJonesPlutusChef,
  PlutusEpochStaking,
} from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(PLUTUS_DEFINITION.id, network)
export class ArbitrumPlutusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.ve.id,
    });
  }

  async getLockedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<PlutusEpochStaking>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.lock.id,
      resolveContract: ({ address, network }) => this.contractFactory.plutusEpochStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .stakedDetails(address)
          .then(details => details.amount),
      resolveRewardTokenBalances: () => [], // TODO: implement
    });
  }

  async getStakedDPXBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsDpxPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.dpx.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsDpxPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [
            info.plsRewardDebt,
            info.plsDpxRewardDebt,
            info.plsJonesRewardDebt,
            info.dpxRewardDebt,
            info.rdpxRewardDebt,
          ]);
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, pendingTokens[i].toString()));
      },
    });
  }

  async getStakedJonesBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsJonesPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.jones.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsJonesPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [info.plsRewardDebt, info.plsDpxRewardDebt, info.plsJonesRewardDebt, info.jonesRewardDebt]);
        const claimableTokens = contractPosition.tokens.filter(t => t.metaType === MetaType.CLAIMABLE);
        return claimableTokens.map((v, i) => drillBalance(v, pendingTokens[i].toString()));
      },
    });
  }

  async getStakedPlsBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PlsPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.stake.id,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.plsPlutusChef({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contractPosition, contract, multicall }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(info => info.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(info => info.rewardDebt),
      }),
    });
  }

  async getBalances(address: string) {
    const [tokenBalances, lockedBalances, dpxBalances, jonesBalances, plsBalances] = await Promise.all([
      this.getTokenBalances(address),
      this.getLockedBalances(address),
      this.getStakedDPXBalances(address),
      this.getStakedJonesBalances(address),
      this.getStakedPlsBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Tokens',
        assets: tokenBalances,
      },
      {
        label: 'Locked',
        assets: lockedBalances,
      },
      {
        label: 'Staked',
        assets: [...dpxBalances, ...jonesBalances, ...plsBalances],
      },
    ]);
  }
}
