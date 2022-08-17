// import { Inject, Injectable } from '@nestjs/common';
// import { compact } from 'lodash';

// import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
// import { ContractType } from '~position/contract.interface';
// import { ContractPosition } from '~position/position.interface';
// import { AppGroupsDefinition } from '~position/position.service';
// import { claimable } from '~position/position.utils';
// import { Network } from '~types/network.interface';

// import { buildDollarDisplayItem } from '../presentation/display-item.present';
// import { getImagesFromToken, getLabelFromToken } from '../presentation/image.present';

// type MerkleContractPositionHelperParams = {
//   address: string;
//   network: Network;
//   appId: string;
//   groupId: string;
//   rewardTokenAddresses: string[];
//   dependencies?: AppGroupsDefinition[];
// };

// @Injectable()
// export class MerkleContractPositionHelper {
//   constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

//   async getContractPositions({
//     address,
//     network,
//     appId,
//     groupId,
//     rewardTokenAddresses = [],
//     dependencies = [],
//   }: MerkleContractPositionHelperParams): Promise<ContractPosition[]> {
//     // Resolve the base tokens and dependency app tokens
//     const [baseTokens, appTokens] = await Promise.all([
//       this.appToolkit.getBaseTokenPrices(network),
//       this.appToolkit.getAppTokenPositions(...dependencies),
//     ]);

//     const positions = rewardTokenAddresses.map(rewardTokenAddress => {
//       const allTokens = [...appTokens, ...baseTokens];
//       const rewardToken = allTokens.find(t => t.address === rewardTokenAddress);
//       if (!rewardToken) return null;

//       const tokens = [claimable(rewardToken)];
//       const dataProps = {};
//       const displayProps = {
//         label: `Claimable ${getLabelFromToken(rewardToken)}`,
//         secondaryLabel: buildDollarDisplayItem(rewardToken.price),
//         images: getImagesFromToken(rewardToken),
//       };

//       const position: ContractPosition = {
//         type: ContractType.POSITION,
//         address,
//         network,
//         appId,
//         groupId,
//         tokens,
//         dataProps,
//         displayProps,
//       };

//       return position;
//     });

//     return compact(positions);
//   }
// }

import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';

export type MerkleContractPositionDescriptor = {
  address: string;
  rewardTokenAddress: string;
};

export abstract class MerkleTemplateContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<T, DefaultDataProps, MerkleContractPositionDescriptor> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract merkleAddress: string;
  abstract getRewardTokenAddresses(): Promise<string[]>;

  async getDescriptors() {
    const rewardTokenAddresses = await this.getRewardTokenAddresses();
    return rewardTokenAddresses.map(rewardTokenAddress => ({ address: this.merkleAddress, rewardTokenAddress }));
  }

  async getTokenDescriptors({ descriptor }: TokenStageParams<T, DefaultDataProps, MerkleContractPositionDescriptor>) {
    return [{ metaType: MetaType.CLAIMABLE, address: descriptor.address }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<T>) {
    const claimableToken = contractPosition.tokens.find(isClaimable)!;
    return `Claimable ${getLabelFromToken(claimableToken)}`;
  }
}
