import { Inject, Injectable } from '@nestjs/common';
import { sumBy, compact } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GoodGhostingGameConfigFetcherHelper } from '../helpers/good-ghosting.game.config-fetcher';

@Injectable()
export class GoodGhostingBalanceFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingGameConfigFetcherHelper)
    private readonly goodGhostingGameConfigFetcherHelper: GoodGhostingGameConfigFetcherHelper,
  ) {}

  async getGameBalances(network: Network, networkId: string, appId: string, groupId: string, address: string) {
    const getGameConfigs = this.goodGhostingGameConfigFetcherHelper.getGameConfigs(networkId);
    const getPlayerGameBalances = this.goodGhostingGameConfigFetcherHelper.getPlayerGameBalances(address, networkId);

    const [gameConfigs, playerGameBalances] = await Promise.all([getGameConfigs, getPlayerGameBalances]);
    const contractPositions = await this.appToolkit.getAppContractPositions({ network, appId, groupIds: [groupId] });

    const interestTokenIndex = 2;
    const incentiveTokenIndex = 3;

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const gameConfig = gameConfigs.find(v => v.address === contractPosition.address)!;
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const incentiveToken = contractPosition.tokens[incentiveTokenIndex];
        const interestToken = contractPosition.tokens[interestTokenIndex];

        if (!playerGameBalances[contractPosition.address]) {
          const balancePositionWithdrawn: ContractPositionBalance = {
            type: ContractType.POSITION,
            network,
            address: contractPosition.address,
            appId,
            groupId,
            tokens: [],
            balanceUSD: 0,
            dataProps: {},
            displayProps: {
              label: appId,
              images: [getAppImg(appId)],
            },
          };
          return balancePositionWithdrawn;
        }

        const {
          incentiveAmount,
          interestAmount,
          isWinner,
          paidAmount,
          rewardAmount,
          poolAPY,
          pooltotalEarningsConverted,
        } = playerGameBalances[contractPosition.address];

        const stakedTokenPrecision = 10 ** stakedToken.decimals;

        const paidAmountRaw = paidAmount * stakedTokenPrecision;
        const interestAmountRaw = interestAmount * stakedTokenPrecision;

        const stakedTokenBalance = drillBalance(stakedToken, paidAmountRaw.toString());
        const playerTokens = [stakedTokenBalance];

        if (rewardToken && isWinner) {
          const rewardTokenPrecision = 10 ** rewardToken.decimals;
          const rewardAmountRaw = rewardAmount * rewardTokenPrecision;
          const claimableTokenBalance = drillBalance(rewardToken, rewardAmountRaw.toString());
          playerTokens.push(claimableTokenBalance);
        }

        if (interestToken && isWinner) {
          const interestTokenBalance = drillBalance(interestToken, interestAmountRaw.toString());
          playerTokens.push(interestTokenBalance);
        }

        if (incentiveToken && isWinner) {
          const incentiveAmountRaw = incentiveAmount * 10 ** incentiveToken.decimals;
          const incentiveTokenBalance = drillBalance(incentiveToken, incentiveAmountRaw.toString());
          playerTokens.push(incentiveTokenBalance);
        }

        const tokens = playerTokens.filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const statsItems = [
          { label: 'Pool APY', value: buildPercentageDisplayItem(poolAPY) },
          { label: 'Pool Earnings', value: buildDollarDisplayItem(pooltotalEarningsConverted) },
        ];

        const contractPositionBalance: ContractPositionBalance = {
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
            images: [getAppImg(appId)],
            statsItems,
          },
        };

        return contractPositionBalance;
      }),
    );

    return compact(balances);
  }
}
