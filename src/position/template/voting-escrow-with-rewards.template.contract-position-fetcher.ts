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

export abstract class VotingEscrowWithRewardsTemplateContractPositionFetcher<
  T extends Contract,
  V extends Contract,
> extends ContractPositionTemplatePositionFetcher<T> {
  abstract veTokenAddress: string;
  abstract rewardAddress: string;
  abstract getEscrowContract(address: string): T;
  abstract getRewardContract(address: string): V;
  abstract getEscrowedTokenAddress(contract: T): Promise<string>;
  abstract getRewardTokenAddress(contract: V): Promise<string>;
  abstract getEscrowedTokenBalance(address: string, contract: T): Promise<BigNumberish>;
  abstract getRewardTokenBalance(address: string, contract: V): Promise<BigNumberish>;

  getContract(address: string): T {
    return this.getEscrowContract(address);
  }

  async getDefinitions() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDefinitions({ multicall }: GetTokenDefinitionsParams<T>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));

    return [
      { metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(escrow) },
      { metaType: MetaType.CLAIMABLE, address: await this.getRewardTokenAddress(reward) },
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
