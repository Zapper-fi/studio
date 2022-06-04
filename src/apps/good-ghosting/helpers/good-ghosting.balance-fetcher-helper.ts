import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GoodghostingAbiV003, GoodGhostingContractFactory } from '../contracts';
import { GoodGhostingGameConfigFetcherHelper } from '../helpers/good-ghosting.game.config-fetcher';

import { ABIVersion } from './constants';

@Injectable()
export class GoodGhostingBalanceFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) private readonly goodGhostingContractFactory: GoodGhostingContractFactory,
    @Inject(GoodGhostingGameConfigFetcherHelper)
    private readonly goodGhostingGameConfigFetcherHelper: GoodGhostingGameConfigFetcherHelper,
  ) { }

  private contractProvider(abiVersion, contractPosition) {
    if (abiVersion === ABIVersion.v001) {
      return this.goodGhostingContractFactory.goodghostingAbiV001(contractPosition);
    }

    if (abiVersion === ABIVersion.v002) {
      return this.goodGhostingContractFactory.goodghostingAbiV002(contractPosition);
    }

    if (abiVersion === ABIVersion.v003) {
      return this.goodGhostingContractFactory.goodghostingAbiV003(contractPosition);
    }

    return this.goodGhostingContractFactory.goodghostingAbiV001(contractPosition);
  }

  async getGameBalances(network: Network, networkId: string, appId: string, groupId: string, address: string) {
    const gameConfigs = await this.goodGhostingGameConfigFetcherHelper.getGameConfigs(networkId);
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId,
      network,
      resolveBalances: async ({ address, multicall, contractPosition }) => {
        const incentiveTokenIndex = 2;

        const gameConfig = gameConfigs.find(v => v.address === contractPosition.address)!;
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const incentiveToken = contractPosition.tokens[incentiveTokenIndex];

        const contract = this.contractProvider(gameConfig.contractVersion, contractPosition);
        const [player, lastSegment, gameInterest] = await Promise.all([
          multicall.wrap(contract).players(address),
          multicall.wrap(contract).lastSegment(),
          multicall.wrap(contract).totalGameInterest(),
        ]);

        let winnerCount: BigNumber | null = null;
        let incentiveAmount: BigNumber | null = null;
        if (gameConfig.contractVersion === ABIVersion.v002 || gameConfig.contractVersion === ABIVersion.v003) {
          [winnerCount, incentiveAmount] = await Promise.all([
            multicall.wrap(contract as GoodghostingAbiV003).winnerCount(),
            multicall.wrap(contract).totalIncentiveAmount(),
          ]);
        }

        const amountPaid = player.amountPaid;
        const mostRecentSegmentPaid = player.mostRecentSegmentPaid.toString();
        const contractLastSegment = lastSegment.sub(1).toString();
        let balance = amountPaid;
        let playerIncentive = BigNumber.from(0);

        if (winnerCount && incentiveAmount && mostRecentSegmentPaid === contractLastSegment) {
          const playerInterest = gameInterest.div(winnerCount);
          playerIncentive = incentiveAmount.div(winnerCount);
          balance = balance.add(playerInterest);
        }

        if (player.withdrawn) {
          balance = BigNumber.from(0);
          return []
        }

        const stakedTokenBalance = drillBalance(stakedToken, amountPaid.toString());
        const playerTokens = [stakedTokenBalance];

        if (rewardToken) {
          const claimableTokenBalance = drillBalance(rewardToken, balance.toString());
          playerTokens.push(claimableTokenBalance);
        }

        if (incentiveToken) {
          const incentiveTokenBalance = drillBalance(incentiveToken, playerIncentive.toString());
          playerTokens.push(incentiveTokenBalance);
        }

        return playerTokens.filter(v => v.balanceUSD > 0);
      },
    });
  }
}
