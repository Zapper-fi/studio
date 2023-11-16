import { BigNumberish } from 'ethers';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPosition, MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

export type CompoundClaimablePositionDataProps = {
  lensAddress: string;
};

export abstract class CompoundClaimableContractPositionFetcher<
  R extends Abi,
  S extends Abi,
> extends ContractPositionTemplatePositionFetcher<R> {
  abstract lensAddress: string;
  abstract rewardTokenAddress: string;
  abstract comptrollerAddress: string;

  abstract getCompoundComptrollerContract(address: string): GetContractReturnType<R, PublicClient>;
  abstract getCompoundLensContract(address: string): GetContractReturnType<S, PublicClient>;
  abstract getClaimableBalance(
    address: string,
    opts: {
      contract: GetContractReturnType<S, PublicClient>;
      contractPosition: ContractPosition<CompoundClaimablePositionDataProps>;
    },
  ): Promise<BigNumberish>;

  getContract(address: string) {
    return this.getCompoundComptrollerContract(address);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.comptrollerAddress }];
  }

  async getTokenDefinitions(
    _opts: GetTokenDefinitionsParams<R, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: this.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<R>) {
    const rewardToken = contractPosition.tokens[0];
    return `Claimable ${getLabelFromToken(rewardToken)}`;
  }

  async getDataProps(
    _params: GetDataPropsParams<R, CompoundClaimablePositionDataProps>,
  ): Promise<CompoundClaimablePositionDataProps> {
    return {
      lensAddress: this.lensAddress,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<R, CompoundClaimablePositionDataProps>): Promise<BigNumberish[]> {
    const {
      dataProps: { lensAddress },
    } = contractPosition;

    const lensContract = this.getCompoundLensContract(lensAddress);
    const claimableBalance = await this.getClaimableBalance(address, { contract: lensContract, contractPosition });
    return [claimableBalance];
  }
}
