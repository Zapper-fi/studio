import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

export type AaveV2ClaimableContractPositionDataProps = {
  incentivesControllerAddress: string;
  protocolDataProviderAddress: string;
};

type AaveV2VariableDebtTokenHelperParams = {
  appId: string;
  groupId: string;
  network: Network;
  incentivesControllerAddress: string;
  protocolDataProviderAddress: string;
  rewardTokenAddress: string;
};

@Injectable()
export class AaveV2ClaimableContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens({
    appId,
    groupId,
    network,
    incentivesControllerAddress,
    protocolDataProviderAddress,
    rewardTokenAddress,
  }: AaveV2VariableDebtTokenHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const rewardToken = baseTokens.find(p => p.address === rewardTokenAddress)!;
    const tokens = [claimable(rewardToken)];
    const position: ContractPosition<AaveV2ClaimableContractPositionDataProps> = {
      type: ContractType.POSITION,
      address: incentivesControllerAddress,
      network,
      appId,
      groupId,
      tokens,
      dataProps: {
        incentivesControllerAddress,
        protocolDataProviderAddress,
      },
      displayProps: {
        label: `Claimable ${rewardToken.symbol}`,
        images: [getTokenImg(rewardToken.address, rewardToken.network)],
        secondaryLabel: buildDollarDisplayItem(rewardToken.price),
      },
    };

    return [position];
  }
}
