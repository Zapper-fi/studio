import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { EulerContractFactory, EulerDtokenContract } from '../contracts';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export type EulerDTokenDataProps = {
  liquidity: number;
  interestRate: number;
  borrowAPY: number;
};

export abstract class EulerDTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerDtokenContract,
  EulerDTokenDataProps,
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

  async getDataProps({
    appToken,
  }: GetDataPropsParams<EulerDtokenContract, EulerDTokenDataProps, EulerTokenDefinition>) {
    const liquidity = appToken.supply * appToken.tokens[0].price * -1;
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    const interestRate = Number(market!.interestRate) / 10 ** appToken.decimals;
    const borrowAPY = (Number(market!.borrowAPY) * 100) / 1e27;

    return { liquidity, interestRate, borrowAPY };
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<EulerDtokenContract, EulerDTokenDataProps>) {
    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) },
      { label: 'APY', value: buildPercentageDisplayItem(appToken.dataProps.borrowAPY) },
    ];
  }
}
