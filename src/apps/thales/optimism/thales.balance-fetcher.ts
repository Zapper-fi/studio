import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(THALES_DEFINITION.id, network)
export class OptimismThalesBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) { }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: THALES_DEFINITION.id,
      groupId: THALES_DEFINITION.groups.staking.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const contract = this.thalesContractFactory.stakingThales(contractPosition);
        const stakedBalanceRaw = await multicall.wrap(contract).stakedBalanceOf(address);
        const claimableBalanceRaw = await multicall.wrap(contract).getRewardsAvailable(address);
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(rewardToken, claimableBalanceRaw.toString()),
        ];
      },
    });
  }

  private async getEscrowedBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: THALES_DEFINITION.id,
      groupId: THALES_DEFINITION.groups.escrow.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const contract = this.thalesContractFactory.escrowThales(contractPosition);
        const escrowedBalanceRaw = await multicall.wrap(contract).totalAccountEscrowedAmount(address);
        return [drillBalance(stakedToken, escrowedBalanceRaw.toString())];
      },
    });
  }

  private async getPool2Balances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: THALES_DEFINITION.id,
      groupId: THALES_DEFINITION.groups.pool2.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const contract = this.thalesContractFactory.lpStaking(contractPosition);
        const pool2BalanceRaw = await multicall.wrap(contract).balanceOf(address);
        const pool2EarnedRaw = await multicall.wrap(contract).earned(address);
        return [
          drillBalance(stakedToken, pool2BalanceRaw.toString()),
          drillBalance(rewardToken, pool2EarnedRaw.toString()),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [stakingBalances, escrowedBalances, pool2Balances] = await Promise.all([
      this.getStakedBalances(address),
      this.getEscrowedBalances(address),
      this.getPool2Balances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staking Thales',
        assets: stakingBalances,
      },
      {
        label: 'Escrow Thales',
        assets: escrowedBalances,
      },
      {
        label: 'LP Staking',
        assets: pool2Balances,
      },
    ]);
  }
}
