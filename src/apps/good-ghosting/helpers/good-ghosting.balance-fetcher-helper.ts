import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { PositionBalance } from '~position/position-balance.interface';
import { ContractType } from '~position/contract.interface';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';
import { GoodGhostingContractFactory } from '../contracts';
import { GoodGhostingGameConfigFetcherHelper } from '../helpers/good-ghosting.game.config-fetcher';
import { ABIVersion, ZERO_BN, BN } from './constants';

@Injectable()
export class GoodGhostingBalanceFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) private readonly goodGhostingContractFactory: GoodGhostingContractFactory,
    @Inject(GoodGhostingGameConfigFetcherHelper)
    private readonly goodGhostingGameConfigFetcherHelper: GoodGhostingGameConfigFetcherHelper,
  ) {}

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

  private async getGameBalances(network: Network, networkId: string, appId: string, groupId: string, address: string) {
    const gameConfigs = await this.goodGhostingGameConfigFetcherHelper.getGameConfigs(networkId);
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId,
      network,
      resolveBalances: async ({ address, multicall, contractPosition }) => {
        const incentiveTokenIndex = 2;

        const balances = await Promise.all(
          gameConfigs.map(async () => {
            const stakedToken = contractPosition.tokens.find(isSupplied)!;
            const rewardToken = contractPosition.tokens.find(isClaimable)!;
            const incentiveToken = contractPosition.tokens[incentiveTokenIndex];
            const gameConfig = gameConfigs.find(v => v.address === contractPosition.address);
            const contract = this.contractProvider(gameConfig.contractVersion, contractPosition);
            const [player, lastSegment, gameInterest] = await Promise.all([
              multicall.wrap(contract).players(address),
              multicall.wrap(contract).lastSegment(),
              multicall.wrap(contract).totalGameInterest(),
            ]);

            let winnerCount: BN;
            let incentiveAmount: BN;

            try {
              [winnerCount, incentiveAmount] = await Promise.all([
                multicall.wrap(contract).winnerCount(),
                multicall.wrap(contract).totalIncentiveAmount(),
              ]);
            } catch (e) {
              // older contracts don't have winnerCount and incentiveAmount variable, so it may revert.
              // we don't need to do anything, just continue.
            }

            const amountPaid = player.amountPaid;
            const mostRecentSegmentPaid = player.mostRecentSegmentPaid.toString();
            const gameLastSegment = lastSegment.sub(1).toString();
            let balance = amountPaid;
            let playerIncentive = ZERO_BN;
            let isWinner = false;

            if (mostRecentSegmentPaid === gameLastSegment) {
              isWinner = true;
            }

            if (winnerCount && isWinner) {
              const playerInterest = gameInterest.div(winnerCount);
              playerIncentive = incentiveAmount.div(winnerCount);

              balance = balance.add(playerInterest);
            }

            if (player.withdrawn) {
              balance = ZERO_BN;
            }

            const stakedTokenBalance = drillBalance(stakedToken, amountPaid.toString());
            const playerTokens = [stakedTokenBalance];
            let secondaryLabel = '';

            if (rewardToken && isWinner) {
              const claimableTokenBalance = drillBalance(rewardToken, balance.toString());
              secondaryLabel = buildDollarDisplayItem(rewardToken.price);
              playerTokens.push(claimableTokenBalance);
            }

            if (incentiveToken) {
              const incentiveTokenBalance = drillBalance(incentiveToken, playerIncentive.toString());
              playerTokens.push(incentiveTokenBalance);
            }

            const tokens = playerTokens.filter(v => v.balanceUSD > 0);
            const balanceUSD = sumBy(tokens, t => t.balanceUSD);

            const statsItems = [];

            const contractPositionBalance: PositionBalance = {
              type: ContractType.POSITION,
              network,
              address: contractPosition.address,
              appId,
              groupId,
              tokens,
              balanceUSD,
              dataProps: {},
              displayProps: {
                label: gameConfig.gameName,
                secondaryLabel,
                images: [getAppImg(appId)],
                statsItems,
              },
            };

            return contractPositionBalance;
          }),
        );

        return balances;
      },
    });
  }
}
