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
    return [{ metaType: MetaType.CLAIMABLE, address: descriptor.rewardTokenAddress }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<T>) {
    const claimableToken = contractPosition.tokens.find(isClaimable)!;
    return `Claimable ${getLabelFromToken(claimableToken)}`;
  }
}
