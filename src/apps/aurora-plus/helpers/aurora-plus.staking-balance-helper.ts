import { Inject, Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BaseTokenBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import AURORA_DEFINITION from '../aurora-plus.definition';
import { AuroraPlusContractFactory } from '../contracts';

const AURORA_ADDRESS = '0x8bec47865ade3b172a928df8f990bc7f2a3b9f79';
const AURORA_STAKING_ADDRESS = '0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec';

type AuroraPlusStakingHelperParams = {
  network: Network;
  address: string;
};

@Injectable()
export class AuroraPlusStakingBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuroraPlusContractFactory) private readonly auroraPlusContractFactory: AuroraPlusContractFactory,
  ) {}

  async getStakingBalance({ address, network }: AuroraPlusStakingHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const aurora = baseTokens.find(t => t.address === AURORA_ADDRESS)!;

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: AURORA_DEFINITION.id,
      groupId: AURORA_DEFINITION.groups.stake.id,
      network,
      resolveBalances: async ({ address, multicall }) => {
        const staking = this.auroraPlusContractFactory.staking({ address: AURORA_STAKING_ADDRESS, network });
        const mcs = multicall.wrap(staking);
        const streamCount = await staking.getStreamsCount();
        const streamIDs = range(0, streamCount.toNumber());
        const rewardTokenAddresses = await Promise.all(
          streamIDs.map((streamID: number) => mcs.getStream(streamID).then(r => r.rewardToken.toLowerCase())),
        );
        const rewardTokens = rewardTokenAddresses.map((addr: string) => baseTokens.find(t => t.address === addr));
        const rewardTokenValues = await Promise.all(
          streamIDs.map((streamID: number) => mcs.getPending(streamID, address)),
        );

        const userTotalDeposit = (await mcs.getUserTotalDeposit(address)).toString();

        const tokens: BaseTokenBalance[] = [];
        if (aurora) tokens.push(drillBalance(aurora, userTotalDeposit));
        streamIDs.forEach((streamID: number) => {
          if (!rewardTokens[streamID]) return;
          tokens.push(drillBalance(rewardTokens[streamID]!, rewardTokenValues[streamID].toString()));
        });

        return tokens;
      },
    });
  }
}
