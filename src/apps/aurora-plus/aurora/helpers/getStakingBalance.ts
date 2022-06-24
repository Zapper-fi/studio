import { ethers } from 'ethers';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AuroraPlusContractFactory } from '../../contracts';
import AURORA_DEFINITION from '../../aurora-plus.definition';

const BN = ethers.BigNumber;

const AURORA_STAKING_ADDRESS = "0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec".toLowerCase();

export default async function getStakingBalance(
    address: string,
    appToolkit: IAppToolkit,
    auroraContractFactory: AuroraPlusContractFactory,
) {
    const network = Network.AURORA_MAINNET;
    return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
        address,
        appId: AURORA_DEFINITION.id,
        groupId: AURORA_DEFINITION.groups.stake.id,
        network,
        resolveBalances: async ({ address, contractPosition, multicall }) => {
            // Resolve the staked token and reward token from the contract position object
            const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;
            const stakingRewards = auroraContractFactory.staking({ address: AURORA_STAKING_ADDRESS, network });
            const PLY_Rewards = contractPosition.tokens[1];
            const BSTN_Rewards = contractPosition.tokens[3];
            const USN_Rewards = contractPosition.tokens[4];
            const TRI_Rewards = contractPosition.tokens[2];

            const mct = multicall.wrap(stakingRewards);
            const balance = await mct.getStreamsCount();
            const indices = range(0, balance.toNumber());
            const rewardTokens = await Promise.all(indices.map((i: number) => mct.getStream(i).then(r => r.rewardToken)));
            const rewardTokenValues = await Promise.all(indices.map((i: number) => mct.getPending(i, address)));

            const userTotalDeposit = (await mct.getUserTotalDeposit(address)).toString();

            return [
                drillBalance(stakedToken, userTotalDeposit),
                drillBalance(PLY_Rewards, rewardTokenValues[1].toString()),
                drillBalance(BSTN_Rewards, rewardTokenValues[3].toString()),
                drillBalance(USN_Rewards, rewardTokenValues[4].toString()),
                drillBalance(TRI_Rewards, rewardTokenValues[2].toString()),
            ];
        },
    });
}
