import { BigNumberish } from 'ethers';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isVesting } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from './contract-position.template.types';

export abstract class VestingEscrowTemplateContractPositionFetcher<
  T extends Abi,
> extends ContractPositionTemplatePositionFetcher<T> {
  abstract veTokenAddress: string;
  abstract getEscrowContract(address: string): GetContractReturnType<T, PublicClient>;
  abstract getEscrowedTokenAddress(params: GetTokenDefinitionsParams<T>): Promise<string>;
  abstract getLockedTokenBalance(params: GetTokenBalancesParams<T>): Promise<BigNumberish>;
  abstract getUnlockedTokenBalance(params: GetTokenBalancesParams<T>): Promise<BigNumberish>;

  getContract(address: string) {
    return this.getEscrowContract(address);
  }

  async getDefinitions() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDefinitions(params: GetTokenDefinitionsParams<T>) {
    return [
      { metaType: MetaType.VESTING, address: await this.getEscrowedTokenAddress(params), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await this.getEscrowedTokenAddress(params), network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const suppliedToken = contractPosition.tokens.find(isVesting)!;
    return `Vesting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T>) {
    return [await this.getLockedTokenBalance(params), await this.getUnlockedTokenBalance(params)];
  }
}
