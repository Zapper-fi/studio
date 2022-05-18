import { SolaceContractFactory } from '../../contracts';
import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';
import { drillBalance } from '~app-toolkit';

import { ethers } from 'ethers';
const BN = ethers.BigNumber;

const XSLOCKER_ADDRESS        = "0x501ace47c5b0c2099c4464f681c3fa2ecd3146c1";
const STAKING_REWARDS_ADDRESS = "0x501ace3d42f9c8723b108d4fbe29989060a91411";

export default async function getXSLockerBalance(address: string, appToolkit: any, solaceContractFactory: SolaceContractFactory) {
  const network = Network.POLYGON_MAINNET;
  return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.xslocker.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find((t:any) => t.metaType === 'supplied')!;
        const rewardToken = contractPosition.tokens.find((t:any) => t.metaType === 'claimable')!;

        const xslocker = solaceContractFactory.xsLocker({ address: XSLOCKER_ADDRESS, network });
        const stakingRewards = solaceContractFactory.stakingRewards({ address: STAKING_REWARDS_ADDRESS, network });

        const mcxsl = multicall.wrap(xslocker);
        const mcsr = multicall.wrap(stakingRewards);

        const balance = await xslocker.balanceOf(address);
        const indices = range(0, balance.toNumber());
        const tokenIDs = await Promise.all(indices.map((i:any) => mcxsl.tokenOfOwnerByIndex(address, i)));
        const locks = await Promise.all(tokenIDs.map(id => mcxsl.locks(id)));
        const rewards = await Promise.all(tokenIDs.map(id => mcsr.pendingRewardsOfLock(id)));

        let supplySum = BN.from(0);
        let rewardSum = BN.from(0);
        indices.forEach((i:any) => {
          supplySum = supplySum.add(locks[i].amount);
          rewardSum = rewardSum.add(rewards[i]);
        });

        return [
          drillBalance(stakedToken, supplySum.toString()),
          drillBalance(rewardToken, rewardSum.toString()),
        ];
      },
    });
}

function range(start: any, stop: any) {
  const arr: any = [];
  for(let i = start; i < stop; i++) arr.push(i);
  return arr;
}
