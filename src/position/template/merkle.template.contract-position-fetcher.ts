import { Inject } from '@nestjs/common';
import { Abi } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { GetDisplayPropsParams, GetTokenDefinitionsParams } from './contract-position.template.types';

export type MerkleContractPositionDefinition = {
  address: string;
  rewardTokenAddress: string;
};

export abstract class MerkleTemplateContractPositionFetcher<
  T extends Abi,
> extends ContractPositionTemplatePositionFetcher<T, DefaultDataProps, MerkleContractPositionDefinition> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract merkleAddress: string;
  abstract getRewardTokenAddresses(): Promise<string[]>;

  async getDefinitions() {
    const rewardTokenAddresses = await this.getRewardTokenAddresses();
    return rewardTokenAddresses.map(rewardTokenAddress => ({ address: this.merkleAddress, rewardTokenAddress }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, MerkleContractPositionDefinition>) {
    return [{ metaType: MetaType.CLAIMABLE, address: definition.rewardTokenAddress, network: this.network }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const claimableToken = contractPosition.tokens.find(isClaimable)!;
    return `Claimable ${getLabelFromToken(claimableToken)}`;
  }
}
