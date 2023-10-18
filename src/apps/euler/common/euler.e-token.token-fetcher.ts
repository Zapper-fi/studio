import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { EulerContractFactory, EulerEtokenContract } from '../contracts';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export abstract class EulerETokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerEtokenContract,
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

  getContract(address: string): EulerEtokenContract {
    return this.contractFactory.eulerEtokenContract({ network: this.network, address });
  }

  async getDefinitions(): Promise<EulerTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.tokenType);
  }

  async getAddresses({ definitions }: GetAddressesParams<EulerTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<EulerEtokenContract, EulerTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getSymbol({ address }): Promise<string> {
    const market = await this.tokenDefinitionsResolver.getMarket(address, this.tokenType);
    return `E${market!.symbol}`;
  }

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<EulerEtokenContract>) {
    const pricePerShareRaw = await multicall
      .wrap(contract)
      .convertBalanceToUnderlying(ethers.BigNumber.from(10).pow(18));
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;
    return [pricePerShare];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    return (this.isDebt ? -1 : 1) * appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    return (Number(market!.supplyAPY) * 100) / 1e27;
  }
}
