import { BigNumberish, Contract } from 'ethers';

import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from './contract-position.template.types';

export abstract class VotingEscrowTemplateContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<T> {
  abstract veTokenAddress: string;
  abstract getEscrowContract(address: string): T;
  abstract getEscrowedTokenAddress(params: GetTokenDefinitionsParams<T>): Promise<string>;
  abstract getEscrowedTokenBalance(params: GetTokenBalancesParams<T>): Promise<BigNumberish>;

  getContract(address: string): T {
    return this.getEscrowContract(address);
  }

  async getDefinitions() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDefinitions(params: GetTokenDefinitionsParams<T>) {
    return [{ metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(params) }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T>) {
    return [await this.getEscrowedTokenBalance(params)];
  }
}
