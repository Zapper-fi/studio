import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { EulerContractFactory, EulerDtokenContract } from '../contracts';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export abstract class EulerDTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerDtokenContract,
  DefaultAppTokenDataProps,
  EulerTokenDefinition
> {
  abstract tokenType: EulerTokenType;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EulerTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: EulerTokenDefinitionsResolver,
    @Inject(EulerContractFactory) protected readonly contractFactory: EulerContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): EulerDtokenContract {
    return this.contractFactory.eulerDtokenContract({ network: this.network, address });
  }

  async getDefinitions(): Promise<EulerTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.tokenType);
  }

  async getAddresses({ definitions }: GetAddressesParams<EulerTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<EulerDtokenContract, EulerTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getSymbol({ address }): Promise<string> {
    const market = await this.tokenDefinitionsResolver.getMarket(address, this.tokenType);
    return `D${market!.symbol}`;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<EulerDtokenContract>) {
    return appToken.supply * appToken.price * -1;
  }

  async getReserves({ appToken }: GetDataPropsParams<EulerDtokenContract>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ appToken }: GetDataPropsParams<EulerDtokenContract>) {
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    return (Number(market!.borrowAPY) * 100) / 1e27;
  }
}
