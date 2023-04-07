import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

export type STokenDataProps = DefaultAppTokenDataProps & {
  siloAddress: string;
};

export type STokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceSTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  STokenDataProps,
  STokenDefinition
> {
  abstract siloLensAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver) protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloMarketAsset({ address, network: this.network });
  }

  async getDefinitions(): Promise<STokenDefinition[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinitions(this.network);
    if (!markets) return [];

    return markets.flatMap(market =>
      market.marketAssets.map(marketAsset => ({
        siloAddress: market.siloAddress,
        address: marketAsset.sToken,
      })),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams<STokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({
    multicall,
    definition,
    appToken,
  }: GetPricePerShareParams<SiloMarketAsset, STokenDataProps, STokenDefinition>): Promise<number[]> {
    const siloLensContract = this.contractFactory.siloLens({ address: this.siloLensAddress, network: this.network });
    const reserveRaw = await multicall
      .wrap(siloLensContract)
      .totalDepositsWithInterest(definition.siloAddress, appToken.tokens[0].address);
    if (reserveRaw.isZero()) return [0];

    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / Number(appToken.supply);
    return [pricePerShare];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, STokenDataProps, STokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }
}
