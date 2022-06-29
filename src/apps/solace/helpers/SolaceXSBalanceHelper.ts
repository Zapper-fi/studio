import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const BN = ethers.BigNumber;

const XSLOCKER_ADDRESS = '0x501ace47c5b0c2099c4464f681c3fa2ecd3146c1';
const STAKING_REWARDS_ADDRESS = '0x501ace3d42f9c8723b108d4fbe29989060a91411';

@Injectable()
export class SolaceXSBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  getBalances({ address, network }: { address: string; network: Network }) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.xslocker.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;
        const rewardToken = contractPosition.tokens.find(t => t.metaType === MetaType.CLAIMABLE)!;

        const xslocker = this.solaceContractFactory.xsLocker({ address: XSLOCKER_ADDRESS, network });
        const stakingRewards = this.solaceContractFactory.stakingRewards({ address: STAKING_REWARDS_ADDRESS, network });

        const mcxsl = multicall.wrap(xslocker);
        const mcsr = multicall.wrap(stakingRewards);

        const balance = await xslocker.balanceOf(address);
        const indices = range(0, balance.toNumber());
        const tokenIDs = await Promise.all(indices.map((i: number) => mcxsl.tokenOfOwnerByIndex(address, i)));
        const locks = await Promise.all(tokenIDs.map(id => mcxsl.locks(id)));
        const rewards = await Promise.all(tokenIDs.map(id => mcsr.pendingRewardsOfLock(id)));

        let supplySum = BN.from(0);
        let rewardSum = BN.from(0);
        indices.forEach((i: number) => {
          supplySum = supplySum.add(locks[i].amount);
          rewardSum = rewardSum.add(rewards[i]);
        });

        return [drillBalance(stakedToken, supplySum.toString()), drillBalance(rewardToken, rewardSum.toString())];
      },
    });
  }
}
