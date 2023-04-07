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

export type DTokenDataProps = DefaultAppTokenDataProps & {
  siloAddress: string;
};

export type DTokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceDTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  DTokenDataProps,
  DTokenDefinition
> {
  isDebt = true;

  abstract siloLensAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver)
    protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloMarketAsset({ address, network: this.network });
  }

  async getDefinitions(): Promise<DTokenDefinition[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinitions(this.network);
    if (!markets) return [];

    return markets.flatMap(market =>
      market.marketAssets.map(marketAsset => ({
        siloAddress: market.siloAddress,
        address: marketAsset.dToken,
      })),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams<DTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({
    multicall,
    definition,
    appToken,
  }: GetPricePerShareParams<SiloMarketAsset, DTokenDataProps, DTokenDefinition>): Promise<number[]> {
    const siloLensContract = this.contractFactory.siloLens({ address: this.siloLensAddress, network: this.network });
    const reserveRaw = await multicall
      .wrap(siloLensContract)
      .totalBorrowAmountWithInterest(definition.siloAddress, appToken.tokens[0].address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / Number(appToken.supply);
    return [pricePerShare];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, DTokenDataProps, DTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }
}
