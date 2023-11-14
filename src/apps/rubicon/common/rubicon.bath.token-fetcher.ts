import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetPricePerShareParams,
  GetDisplayPropsParams,
  GetTokenPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { RubiconViemContractFactory } from '../contracts';
import { BathToken } from '../contracts/viem';

import { RubiconBathTokenDefinitionResolver } from './rubicon.bath.token-definition-resolver';

export type RubiconPoolDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class RubiconBathTokenFetcher extends AppTokenTemplatePositionFetcher<
  BathToken,
  DefaultAppTokenDataProps,
  RubiconPoolDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RubiconBathTokenDefinitionResolver)
    private readonly bathTokenDefinitionResolver: RubiconBathTokenDefinitionResolver,
    @Inject(RubiconViemContractFactory) private readonly contractFactory: RubiconViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.bathToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<RubiconPoolDefinition[]> {
    return this.bathTokenDefinitionResolver.getPoolDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams<RubiconPoolDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<BathToken, RubiconPoolDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getSupply({
    multicall,
    definition,
    contract,
  }: GetTokenPropsParams<BathToken, DefaultAppTokenDataProps, RubiconPoolDefinition>) {
    const underlyingAssetContract = this.appToolkit.globalViemContracts.erc20({
      address: definition.underlyingTokenAddress,
      network: this.network,
    });

    const supplyRaw = await contract.read.totalSupply();
    const decimal = await contract.read.decimals();
    const decimalsUnderlying = await multicall.wrap(underlyingAssetContract).read.decimals();
    const supply = (Number(supplyRaw) / 10 ** decimalsUnderlying) * 10 ** decimal;

    return supply;
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<BathToken, DefaultDataProps, RubiconPoolDefinition>) {
    const oneUnit = BigNumber.from(10).pow(18).toString();
    const ratioRaw = await contract.read.convertToAssets([BigInt(oneUnit)]);
    const ratio = Number(ratioRaw) / 10 ** appToken.decimals;
    return [ratio];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BathToken>) {
    return appToken.tokens[0].symbol;
  }
}
