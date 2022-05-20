import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CompoundContractFactory } from '../contracts';

type CompoundBalanceHelperParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  lensAddress: string;
  rewardTokenAddress: string;
  comptrollerAddress: string;
};

@Injectable()
export class CompoundClaimableBalanceHelper {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getBalances({
    address,
    network,
    appId,
    groupId,
    lensAddress,
    rewardTokenAddress,
    comptrollerAddress,
  }: CompoundBalanceHelperParams) {
    const lensContract = this.compoundContractFactory.compoundLens({ address: lensAddress, network });
    const prices = await this.appToolkit.getBaseTokenPrices(network);

    // Resolve reward metadata
    const rewardMetadata = await lensContract.callStatic.getCompBalanceMetadataExt(
      rewardTokenAddress,
      comptrollerAddress,
      address,
    );

    // Calculate claimable COMP rewards
    const rewardToken = prices.find(price => price.address === rewardTokenAddress);
    if (!rewardToken) return [];

    const rewardBalanceRaw = rewardMetadata[3];
    const rewardTokenWithMetaType = { metaType: MetaType.CLAIMABLE, ...rewardToken };
    const tokenBalance = drillBalance(rewardTokenWithMetaType, rewardBalanceRaw.toString());

    // Display Props
    const label = `Claimable ${rewardToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(rewardToken.price);
    const images = [getTokenImg(rewardToken.address, network)];
    const statsItems = [];
    const displayProps = { label, secondaryLabel, images, statsItems };

    const contractPositionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: comptrollerAddress,
      appId,
      groupId,
      network,
      dataProps: {},
      displayProps,
      tokens: [tokenBalance],
      balanceUSD: tokenBalance.balanceUSD,
    };

    return [contractPositionBalance];
  }
}
