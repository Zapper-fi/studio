import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { CompoundComptroller, CompoundContractFactory } from '../contracts';

export type CompoundClaimablePositionDataProps = {
  lensAddress: string;
};

export abstract class CompoundClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CompoundComptroller> {
  abstract lensAddress: string;
  abstract rewardTokenAddress: string;
  abstract comptrollerAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory) private readonly contractFactory: CompoundContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CompoundComptroller {
    return this.contractFactory.compoundComptroller({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.comptrollerAddress }];
  }

  async getTokenDefinitions(
    _opts: GetTokenDefinitionsParams<CompoundComptroller, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ address: this.rewardTokenAddress, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CompoundComptroller>) {
    const rewardToken = contractPosition.tokens[0];
    return `Claimable ${getLabelFromToken(rewardToken)}`;
  }

  async getDataProps(
    _params: GetDataPropsParams<CompoundComptroller, CompoundClaimablePositionDataProps>,
  ): Promise<CompoundClaimablePositionDataProps> {
    return {
      lensAddress: this.lensAddress,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<CompoundComptroller, CompoundClaimablePositionDataProps>): Promise<BigNumberish[]> {
    const [rewardToken] = contractPosition.tokens;
    const {
      address: comptrollerAddress,
      dataProps: { lensAddress },
    } = contractPosition;

    const lensContract = this.contractFactory.compoundLens({ address: lensAddress, network: this.network });
    const rewardMetadata = await lensContract.callStatic.getCompBalanceMetadataExt(
      rewardToken.address,
      comptrollerAddress,
      address,
    );

    const rewardBalanceRaw = rewardMetadata[3];
    return [rewardBalanceRaw];
  }
}
