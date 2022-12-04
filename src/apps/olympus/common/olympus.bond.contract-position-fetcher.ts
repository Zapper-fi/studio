import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

export type OlympusBondContractPositionDefinition = {
  address: string;
  mintedTokenAddress: string;
  bondedTokenAddress: string;
};

export type ResolveClaimableBalanceParams<T extends Contract> = {
  address: string;
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveVestingBalanceParams<T extends Contract> = {
  address: string;
  contract: T;
  multicall: IMulticallWrapper;
};

export abstract class OlympusBondContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<T, DefaultDataProps, OlympusBondContractPositionDefinition> {
  abstract bondDefinitions: OlympusBondContractPositionDefinition[];

  abstract resolveVestingBalance(params: ResolveVestingBalanceParams<T>): Promise<BigNumberish>;
  abstract resolveClaimableBalance(params: ResolveClaimableBalanceParams<T>): Promise<BigNumberish>;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<OlympusBondContractPositionDefinition[]> {
    return this.bondDefinitions;
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, OlympusBondContractPositionDefinition>) {
    return [
      { metaType: MetaType.VESTING, address: definition.mintedTokenAddress, network: this.network },
      { metaType: MetaType.CLAIMABLE, address: definition.mintedTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.bondedTokenAddress, network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<T, DefaultDataProps>): Promise<BigNumberish[]> {
    const vestingAmountRaw = await this.resolveVestingBalance({ address, contract, multicall });
    const claimableAmountRaw = await this.resolveClaimableBalance({ address, contract, multicall });
    return [vestingAmountRaw, claimableAmountRaw, 0];
  }
}
