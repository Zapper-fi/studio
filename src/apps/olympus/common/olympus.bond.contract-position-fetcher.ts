import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { Abi } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDefinitionsParams,
} from '~position/template/contract-position.template.types';

export type OlympusBondContractPositionDefinition = {
  address: string;
  mintedTokenAddress: string;
  bondedTokenAddress: string;
};

export abstract class OlympusBondContractPositionFetcher<
  T extends Abi,
  V extends DefaultDataProps = DefaultDataProps,
  R extends OlympusBondContractPositionDefinition = OlympusBondContractPositionDefinition,
> extends ContractPositionTemplatePositionFetcher<T, V, R> {
  abstract resolveBondDefinitions(params: GetDefinitionsParams): Promise<R[]>;
  abstract resolveVestingBalance(params: GetTokenBalancesParams<T, V>): Promise<BigNumberish>;
  abstract resolveClaimableBalance(params: GetTokenBalancesParams<T, V>): Promise<BigNumberish>;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<R[]> {
    return this.resolveBondDefinitions(params);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, R>) {
    return [
      { metaType: MetaType.VESTING, address: definition.mintedTokenAddress, network: this.network },
      { metaType: MetaType.CLAIMABLE, address: definition.mintedTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.bondedTokenAddress, network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, V>): Promise<BigNumberish[]> {
    const vestingAmountRaw = await this.resolveVestingBalance(params);
    const claimableAmountRaw = await this.resolveClaimableBalance(params);
    return [vestingAmountRaw, claimableAmountRaw, 0];
  }
}
