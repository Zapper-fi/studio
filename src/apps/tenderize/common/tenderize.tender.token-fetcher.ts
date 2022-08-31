import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { TenderizeContractFactory, TenderToken } from '../contracts';

import { TenderizeTokenDefinition } from './tenderize-token-definition';
import { TenderizeTokenDefinitionsResolver } from './tenderize.token-definition-resolver';

export abstract class TenderTokenFetcher extends AppTokenTemplatePositionFetcher<
  TenderToken,
  DefaultDataProps,
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
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams<TenderizeTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<TenderToken, TenderizeTokenDefinition>) {
    return definition.steak;
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
    return pricePerShare;
  }

  async getDataProps(opts: GetDataPropsParams<TenderToken, DefaultDataProps, TenderizeTokenDefinition>) {
    const { appToken, definition } = opts;
    const reserve = Number(appToken.pricePerShare) * appToken.supply;
    const liquidity = reserve * appToken.tokens[0].price;
    const apy = await this.tokenDefinitionsResolver.getTokenApy(definition.id);

    return { liquidity, apy };
  }
}
