import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

export type CompoundClaimablePositionDataProps = {
  lensAddress: string;
};

type CompoundBalanceHelperParams = {
  network: Network;
  appId: string;
  groupId: string;
  lensAddress: string;
  rewardTokenAddress: string;
  comptrollerAddress: string;
};

@Injectable()
export class CompoundClaimableContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions({
    network,
    appId,
    groupId,
    lensAddress,
    rewardTokenAddress,
    comptrollerAddress,
  }: CompoundBalanceHelperParams) {
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    // Calculate claimable COMP rewards
    const rewardToken = (await tokenSelector.getOne({ network, address: rewardTokenAddress }))!;
    const rewardTokenWithMetaType = { metaType: MetaType.CLAIMABLE, ...rewardToken };

    // Display Props
    const label = `Claimable ${rewardToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(rewardToken.price);
    const images = [getTokenImg(rewardToken.address, network)];
    const statsItems = [];
    const displayProps = { label, secondaryLabel, images, statsItems };

    const contractPosition: ContractPosition<CompoundClaimablePositionDataProps> = {
      type: ContractType.POSITION,
      address: comptrollerAddress,
      appId,
      groupId,
      network,
      dataProps: { lensAddress },
      displayProps,
      tokens: [rewardTokenWithMetaType],
    };

    return [contractPosition];
  }
}
