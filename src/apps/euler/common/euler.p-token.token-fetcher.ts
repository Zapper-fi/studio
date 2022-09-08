import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { EulerContractFactory, EulerPtokenContract } from '../contracts';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export type EulerPTokenDataProps = {
  liquidity: number;
  interestRate: number;
};

export abstract class EulerPTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerPtokenContract,
  EulerPTokenDataProps,
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

  getContract(address: string): EulerPtokenContract {
    return this.contractFactory.eulerPtokenContract({ network: this.network, address });
  }

  async getDefinitions(): Promise<EulerTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.tokenType);
  }

  async getAddresses({ definitions }: GetAddressesParams<EulerTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<EulerPtokenContract, EulerTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getSymbol({ address }): Promise<string> {
    const market = await this.tokenDefinitionsResolver.getMarket(address, this.tokenType);
    return `P${market!.symbol}`;
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<EulerPtokenContract, EulerPTokenDataProps, EulerTokenDefinition>) {
    const liquidity = appToken.supply * appToken.tokens[0].price * -1;
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    const interestRate = Number(market!.interestRate) / 10 ** appToken.decimals;

    return { liquidity, interestRate };
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<EulerPtokenContract, EulerPTokenDataProps>) {
    return [{ label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) }];
  }
}
