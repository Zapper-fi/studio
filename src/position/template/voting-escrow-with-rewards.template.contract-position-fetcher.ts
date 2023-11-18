import { BigNumberish } from 'ethers';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from './contract-position.template.types';

export abstract class VotingEscrowWithRewardsTemplateContractPositionFetcher<
  T extends Abi,
  V extends Abi,
> extends ContractPositionTemplatePositionFetcher<T> {
  abstract veTokenAddress: string;
  abstract rewardAddress: string;
  abstract getEscrowContract(address: string): GetContractReturnType<T, PublicClient>;
  abstract getRewardContract(address: string): GetContractReturnType<V, PublicClient>;
  abstract getEscrowedTokenAddress(contract: GetContractReturnType<T, PublicClient>): Promise<string>;
  abstract getRewardTokenAddress(contract: GetContractReturnType<V, PublicClient>): Promise<string>;
  abstract getEscrowedTokenBalance(
    address: string,
    contract: GetContractReturnType<T, PublicClient>,
  ): Promise<BigNumberish>;
  abstract getRewardTokenBalance(
    address: string,
    contract: GetContractReturnType<V, PublicClient>,
  ): Promise<BigNumberish>;

  getContract(address: string): GetContractReturnType<T, PublicClient> {
    return this.getEscrowContract(address);
  }

  async getDefinitions() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDefinitions({ multicall }: GetTokenDefinitionsParams<T>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));

    return [
      { metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(escrow), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await this.getRewardTokenAddress(reward), network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, multicall }: GetTokenBalancesParams<T>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));
    return [await this.getEscrowedTokenBalance(address, escrow), await this.getRewardTokenBalance(address, reward)];
  }
}
