import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  GetPriceParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { TenderizeContractFactory, TenderToken } from '../contracts';

import { TenderizeTokenDefinition } from './tenderize-token-definition';
import { TenderizeTokenDefinitionsResolver } from './tenderize.token-definition-resolver';

export abstract class SwapTokenFetcher extends AppTokenTemplatePositionFetcher<
  TenderToken,
  DefaultAppTokenDataProps,
  TenderizeTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TenderizeTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: TenderizeTokenDefinitionsResolver,
    @Inject(TenderizeContractFactory) protected readonly contractFactory: TenderizeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TenderToken {
    return this.contractFactory.tenderToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<TenderizeTokenDefinition[]> {
    const definitions = await this.tokenDefinitionsResolver.getTokenDefinitions(this.network);
    return definitions.map(v => ({ ...v, address: v.lpToken }));
  }

  async getAddresses({ definitions }: GetAddressesParams<TenderizeTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.lpToken);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<TenderToken, TenderizeTokenDefinition>) {
    return [
      { address: definition.steak, network: this.network },
      { address: definition.tenderToken, network: this.network },
    ];
  }

  async getPricePerShare() {
    return [0.5, 0.5];
  }

  async getPrice({
    appToken,
  }: GetPriceParams<TenderToken, DefaultAppTokenDataProps, TenderizeTokenDefinition>): Promise<number> {
    return appToken.tokens[0].price;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<TenderToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<TenderToken>) {
    return (appToken.pricePerShare as number[]).map(t => t * appToken.supply);
  }

  async getApy() {
    return 0;
  }
}
