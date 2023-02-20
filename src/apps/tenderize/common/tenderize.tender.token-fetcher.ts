import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { TenderizeContractFactory, TenderToken } from '../contracts';

import { TenderizeTokenDefinition } from './tenderize-token-definition';
import { TenderizeTokenDefinitionsResolver } from './tenderize.token-definition-resolver';

export abstract class TenderTokenFetcher extends AppTokenTemplatePositionFetcher<
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
    return definitions.map(v => ({ ...v, address: v.tenderToken }));
  }

  async getAddresses({ definitions }: GetAddressesParams<TenderizeTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.tenderToken);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<TenderToken, TenderizeTokenDefinition>) {
    return [{ address: definition.steak, network: this.network }];
  }

  async getPricePerShare({
    appToken,
    multicall,
    definition,
  }: GetPricePerShareParams<TenderToken, DefaultDataProps, TenderizeTokenDefinition>) {
    const tenderSwapContract = this.contractFactory.tenderSwap({
      address: definition.tenderSwap,
      network: this.network,
    });

    const pricePerShareRaw = await multicall.wrap(tenderSwapContract).getVirtualPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare];
  }

  async getApy({ definition }: GetDataPropsParams<TenderToken, DefaultDataProps, TenderizeTokenDefinition>) {
    return this.tokenDefinitionsResolver.getTokenApy(definition.id);
  }
}
