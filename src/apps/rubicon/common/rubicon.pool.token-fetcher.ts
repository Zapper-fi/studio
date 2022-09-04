import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenPropsParams,
} from '~position/template/app-token.template.types';

import { BathToken, RubiconContractFactory } from '../contracts';

import { RubiconPoolDefinitionsResolver } from './rubicon.pool-definition-resolver';

export type RubiconPoolDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class RubiconPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BathToken,
  DefaultDataProps,
  RubiconPoolDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RubiconPoolDefinitionsResolver)
    private readonly poolDefinitionsResolver: RubiconPoolDefinitionsResolver,
    @Inject(RubiconContractFactory) private readonly contractFactory: RubiconContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BathToken {
    return this.contractFactory.bathToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<RubiconPoolDefinition[]> {
    return this.poolDefinitionsResolver.getPoolDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams<RubiconPoolDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<BathToken, RubiconPoolDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getSupply({ multicall, definition, contract }: GetTokenPropsParams<BathToken, RubiconPoolDefinition>) {
    const underlyingAssetContract = this.contractFactory.erc20({
      address: definition.underlyingTokenAddress,
      network: this.network,
    });

    const supplyRaw = await contract.totalSupply();
    const decimal = await contract.decimals();
    const decimalsUnderlying = await multicall.wrap(underlyingAssetContract).decimals();
    const supply = (Number(supplyRaw) / 10 ** decimalsUnderlying) * 10 ** decimal;

    return supply;
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<BathToken, DefaultDataProps, RubiconPoolDefinition>) {
    const ratioRaw = await contract.convertToAssets(BigNumber.from((1e18).toString()));
    return Number(ratioRaw) / 10 ** appToken.decimals;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BathToken>) {
    return appToken.tokens[0].symbol;
  }

  async getDataProps(opts: GetDataPropsParams<BathToken, DefaultDataProps, RubiconPoolDefinition>) {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
