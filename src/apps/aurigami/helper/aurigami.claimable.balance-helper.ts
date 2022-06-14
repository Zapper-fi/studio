import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AurigamiContractFactory } from '../contracts';

type AurigamiClaimableBalanceHelperParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  lensAddress: string;
  comptrollerAddress: string;
  fairlaunchAddress: string;
  rewardAddress: string;
  stakingPoolIds: number[];
};

@Injectable()
export class AurigamiClaimableBalanceHelper {
  constructor(
    @Inject(AurigamiContractFactory) private readonly aurigamiContractFactory: AurigamiContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getBalances({
    address,
    network,
    appId,
    groupId,
    lensAddress,
    fairlaunchAddress,
    comptrollerAddress,
    stakingPoolIds,
    rewardAddress,
  }: AurigamiClaimableBalanceHelperParams) {
    const rewardToken = await this.appToolkit.getBaseTokenPrice({ network, address: rewardAddress });
    // Return if we can't fetch the reward token price
    if (!rewardToken) return [];

    const lensContract = this.aurigamiContractFactory.aurigamiLens({ address: lensAddress, network });

    // Resolve reward metadata
    const rewardMetadata = await lensContract.callStatic.claimRewards(
      comptrollerAddress,
      fairlaunchAddress,
      stakingPoolIds,
      { from: address },
    );

    // Calculate claimable PLY rewards

    const rewardBalanceRaw = rewardMetadata.plyAccrured;
    const tokenBalance = drillBalance(claimable(rewardToken), rewardBalanceRaw.toString());

    const contractPositionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: comptrollerAddress,
      appId,
      groupId,
      network,
      dataProps: {},
      displayProps: {
        label: `Claimable ${rewardToken.symbol}`,
        secondaryLabel: buildDollarDisplayItem(rewardToken.price),
        images: [getTokenImg(rewardToken.address, network)],
      },
      tokens: [tokenBalance],
      balanceUSD: tokenBalance.balanceUSD,
    };

    return [contractPositionBalance];
  }
}
