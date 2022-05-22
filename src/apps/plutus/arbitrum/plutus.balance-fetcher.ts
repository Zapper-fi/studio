import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  PlutusContractFactory,
  MasterChef,
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
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<PlsDpxPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.dpx.id,
      resolveContract: ({ address, network }) => this.contractFactory.plsDpxPlutusChef({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => info.amount),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => {
        return multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [
            info.plsRewardDebt,
            info.plsDpxRewardDebt,
            info.plsJonesRewardDebt,
            info.dpxRewardDebt,
            info.rdpxRewardDebt,
          ]);
      },
    });
  }

  async getStakedJonesBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<PlsJonesPlutusChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.jones.id,
      resolveContract: ({ address, network }) => this.contractFactory.plsJonesPlutusChef({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => info.amount),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => {
        return multicall
          .wrap(contract)
          .userInfo(address)
          .then(info => [info.plsRewardDebt, info.plsDpxRewardDebt, info.plsJonesRewardDebt, info.jonesRewardDebt]);
      },
    });
  }

  async getStakedPlsBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MasterChef>({
      address,
      network,
      appId,
      groupId: PLUTUS_DEFINITION.groups.stake.id,
      resolveContract: ({ address, network }) => this.contractFactory.masterChef({ address, network }),
      resolveStakedTokenBalance: async ({ contract, address, multicall }) => {
        const pool = Number(await multicall.wrap(contract).poolLength()) - 1;
        return await multicall
          .wrap(contract)
          .userInfo(pool, address)
          .then(info => info.amount);
      },
      resolveRewardTokenBalances: async ({ contract, address, multicall }) => {
        const pool = Number(await multicall.wrap(contract).poolLength()) - 1;
        return multicall
          .wrap(contract)
          .userInfo(pool, address)
          .then(info => info.rewardDebt);
      },
    });
  }

  async getBalances(address: string) {
    const [tokenBalances, lockedBalances, dpxBalances, jonesBalances, plsBalances] = await Promise.all([
      this.getTokenBalances(address),
      this.getStakedDPXBalances(address),
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
