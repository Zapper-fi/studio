import { BigNumberish, Contract } from 'ethers';

import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';

export abstract class VotingEscrowTokenFetcher<T extends Contract> extends ContractPositionTemplatePositionFetcher<T> {
  abstract veTokenAddress: string;
  abstract getEscrowedTokenAddress(params: TokenStageParams<T>): Promise<string>;
  abstract getEscrowedTokenBalance(params: GetTokenBalancesPerPositionParams<T>): Promise<BigNumberish>;

  async getDescriptors() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDescriptors(params: TokenStageParams<T>) {
    return [{ metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(params) }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<T>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesPerPositionParams<T>) {
    return [await this.getEscrowedTokenBalance(params)];
  }
}
