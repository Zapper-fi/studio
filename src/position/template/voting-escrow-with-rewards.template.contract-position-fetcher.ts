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

  async getDescriptors() {
    return [{ address: this.veTokenAddress }];
  }

  async getTokenDescriptors({ multicall }: TokenStageParams<T>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));

    return [
      { metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(escrow) },
      { metaType: MetaType.CLAIMABLE, address: await this.getRewardTokenAddress(reward) },
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<T>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({ address, multicall }: GetTokenBalancesPerPositionParams<T>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));
    return [await this.getEscrowedTokenBalance(address, escrow), await this.getRewardTokenBalance(address, reward)];
  }
}
