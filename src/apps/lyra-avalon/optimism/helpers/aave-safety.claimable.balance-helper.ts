import { Inject, Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { filter, groupBy, map, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

export type AaveSafetyHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  resolveContract: (opts: { address: string; network: Network }) => T;
  resolveVaultAddresses: (opts: { multicall: IMulticallWrapper; network: Network }) => string[] | Promise<string[]>;
};

@Injectable()
export class AaveSafetyModuleClaimableBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T extends Contract>(
    address: string,
    { network, appId, groupId, dependencies = [], resolveContract, resolveVaultAddresses }: AaveSafetyHelperParams<T>,
  ) {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const allTokens = [...appTokens, ...baseTokens];
    const vaultAddresses = await resolveVaultAddresses({ multicall, network });

    const rewards = await Promise.all(
      vaultAddresses.map(async vaultAddress => {
        const contract = resolveContract({ address: vaultAddress, network });
        const stakedToken = allTokens.find(p => p.address === contract.address);
        if (!stakedToken) return;

        const rewardTokenAddress = await multicall.wrap(contract).REWARD_TOKEN();
        const rewardToken = allTokens.find(p => p.address === rewardTokenAddress.toLowerCase());
        if (!rewardToken) return;

        const rewardBalanceRaw = await multicall.wrap(contract).getTotalRewardsBalance(address);
        return {
          rewardToken,
          rewardBalance: Number(rewardBalanceRaw),
        };
      }),
    );

    const rewardPositions = map(groupBy(filter(rewards), 'rewardToken.address'), rewards => {
      const rewardBalance = sumBy(rewards, 'rewardBalance');
      const rewardToken = rewards[0]!.rewardToken;
      const tokens = [drillBalance(claimable(rewardToken), rewardBalance.toString())];

      const dataProps = {};
      const displayProps = {
        label: `Claimable ${rewardToken.symbol}`,
        secondaryLabel: buildDollarDisplayItem(rewardToken.price),
        images: [getTokenImg(rewardToken.address, network)],
        statsItems: [],
      };

      const rewardPosition: ContractPositionBalance = {
        type: ContractType.POSITION,
        address: vaultAddresses[0],
        network,
        appId,
        groupId,
        tokens,
        balanceUSD: sumBy(tokens, 'balanceUSD'),
        dataProps,
        displayProps,
      };
      return rewardPosition;
    });

    return rewardPositions;
  }
}
