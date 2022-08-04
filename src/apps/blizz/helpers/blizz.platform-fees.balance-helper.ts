import { Inject, Injectable } from '@nestjs/common';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable, locked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { BLIZZ_DEFINITION } from '../blizz.definition';
import { BlizzContractFactory } from '../contracts';

type BlizzPlatformFeesBalanceParams = {
  address: string;
  network: Network;
};

@Injectable()
export class BlizzPlatformFeesBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BlizzContractFactory) private readonly contractFactory: BlizzContractFactory,
  ) {}

  async getBalances({ address, network }: BlizzPlatformFeesBalanceParams) {
    // This is effectively copy-pasta from Adamant, with additional platform fees
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: BLIZZ_DEFINITION.id,
      groupIds: [BLIZZ_DEFINITION.groups.supply.id],
      network,
    });

    const allTokens = [...appTokens, ...baseTokens];
    const blizzToken = baseTokens.find(v => v.symbol === 'BLZZ')!;
    const blizzStakingAddress = '0xa867c1aca4b5f1e0a66cf7b1fe33525d57608854';
    const contract = this.contractFactory.blizzStaking({ address: blizzStakingAddress, network });

    const [lockedBalancesData, withdrawableDataRaw, unlockedBalanceRaw, claimablePlatformFees] = await Promise.all([
      multicall.wrap(contract).lockedBalances(address),
      multicall.wrap(contract).withdrawableBalance(address),
      multicall.wrap(contract).unlockedBalance(address),
      multicall.wrap(contract).claimableRewards(address),
    ]);

    const vestedBalanceRaw = withdrawableDataRaw.amount
      .add(withdrawableDataRaw.penaltyAmount)
      .sub(unlockedBalanceRaw)
      .toString();

    const lockedBlizzToken = drillBalance(locked(blizzToken), lockedBalancesData.total.toString());
    const unlockedBlizzToken = drillBalance(claimable(blizzToken), unlockedBalanceRaw.toString());
    const vestedBlizzToken = drillBalance(claimable(blizzToken), vestedBalanceRaw);

    const rewardTokens = claimablePlatformFees.map(([tokenAddressRaw, balanceRaw]) => {
      const rewardToken = allTokens.find(v => v.address === tokenAddressRaw.toLowerCase());
      return rewardToken ? drillBalance(claimable(rewardToken), balanceRaw.toString()) : null;
    });

    const tokensInContract = compact([lockedBlizzToken, unlockedBlizzToken, vestedBlizzToken, ...rewardTokens]);
    const tokens = tokensInContract.filter(v => v.balanceUSD > 0);
    const balanceUSD = sumBy(tokens, t => t.balanceUSD);

    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: blizzStakingAddress,
      appId: BLIZZ_DEFINITION.id,
      groupId: BLIZZ_DEFINITION.groups.claimable.id,
      network,
      tokens,
      balanceUSD,

      dataProps: {},

      displayProps: {
        label: `${blizzToken.symbol} Locking`,
        secondaryLabel: buildDollarDisplayItem(blizzToken.price),
        images: [getTokenImg(blizzToken.address, network)],
      },
    };

    return [positionBalance];
  }
}
