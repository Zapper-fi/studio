import { ethers } from 'ethers';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AuroraPlusContractFactory } from '../../contracts';
import AURORA_DEFINITION from '../../aurora-plus.definition';

const BN = ethers.BigNumber;

const AURORA_ADDRESS = "0x8bec47865ade3b172a928df8f990bc7f2a3b9f79".toLowerCase();
const AURORA_STAKING_ADDRESS = "0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec".toLowerCase();

export default async function getStakingBalance(
    address: string,
    appToolkit: IAppToolkit,
    auroraPlusContractFactory: AuroraPlusContractFactory,
) {
    const network = Network.AURORA_MAINNET;
    return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
        address,
        appId: AURORA_DEFINITION.id,
        groupId: AURORA_DEFINITION.groups.stake.id,
        network,
        resolveBalances: async ({ address, contractPosition, multicall }) => {
            // Resolve the staked token and reward token from the contract position object
            const baseTokens = await appToolkit.getBaseTokenPrices(network);
            const aurora = baseTokens.find(t => t.address === AURORA_ADDRESS)!;

            const staking = auroraPlusContractFactory.staking({ address: AURORA_STAKING_ADDRESS, network });
            const mcs = multicall.wrap(staking);
            const streamCount = await staking.getStreamsCount();
            const streamIDs = range(0, streamCount.toNumber());
            const rewardTokenAddresses = await Promise.all(streamIDs.map((streamID:number) => mcs.getStream(streamID).then(r => r.rewardToken.toLowerCase())));
            const rewardTokens = rewardTokenAddresses.map((addr:string) => baseTokens.find(t => t.address === addr));
            const rewardTokenValues = await Promise.all(streamIDs.map((streamID: number) => mcs.getPending(streamID, address)));

            const userTotalDeposit = (await mcs.getUserTotalDeposit(address)).toString();

            let tokens:any = [];
            if(!!aurora) tokens.push(drillBalance(aurora, userTotalDeposit));
            streamIDs.forEach((streamID:number) => {
              if(!rewardTokens[streamID]) return;
              tokens.push(drillBalance(rewardTokens[streamID]!, rewardTokenValues[streamID].toString()));
            });

            console.log(tokens);
            return tokens;
        },
    });
}
