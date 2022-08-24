import { Inject, Injectable } from '@nestjs/common';
import { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable, locked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GeistContractFactory } from '../contracts';
import { GEIST_DEFINITION } from '../geist.definition';

type GeistPlatformFeesBalanceParams = {
  address: string;
  network: Network;
};

@Injectable()
export class GeistPlatformFeesBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GeistContractFactory) private readonly contractFactory: GeistContractFactory,
  ) {}

  async getBalances({ address, network }: GeistPlatformFeesBalanceParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: GEIST_DEFINITION.id,
      groupIds: [GEIST_DEFINITION.groups.supply.id],
      network,
    });

    const allTokens = [...appTokens, ...baseTokens];
    const lockedToken = baseTokens.find(v => v.symbol === 'GEIST')!;
    const lockAddress = '0x49c93a95dbcc9a6a4d8f77e59c038ce5020e82f8';
    const contract = this.contractFactory.geistStaking({ address: lockAddress, network });

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

    const lockedTokenBalance = drillBalance(locked(lockedToken), lockedBalancesData.total.toString());
    const unlockedTokenBalance = drillBalance(claimable(lockedToken), unlockedBalanceRaw.toString());
    const vestedTokenBalance = drillBalance(claimable(lockedToken), vestedBalanceRaw);

    const rewardTokens = claimablePlatformFees.map(([tokenAddressRaw, balanceRaw]) => {
      const rewardToken = allTokens.find(v => v.address === tokenAddressRaw.toLowerCase());
      return rewardToken ? drillBalance(claimable(rewardToken), balanceRaw.toString()) : null;
    });

    const tokensInContract = compact([lockedTokenBalance, unlockedTokenBalance, vestedTokenBalance, ...rewardTokens]);
    const tokens = tokensInContract.filter(v => v.balanceUSD > 0);
    const balanceUSD = sumBy(tokens, t => t.balanceUSD);

    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: lockAddress,
      appId: GEIST_DEFINITION.id,
      groupId: GEIST_DEFINITION.groups.platformFees.id,
      network,
      tokens,
      balanceUSD,

      dataProps: {},

      displayProps: {
        label: `${lockedToken.symbol} Locking`,
        secondaryLabel: buildDollarDisplayItem(lockedToken.price),
        images: [getTokenImg(lockedToken.address, network)],
      },
    };

    return [positionBalance];
  }
}
