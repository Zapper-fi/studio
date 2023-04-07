import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

export type SpTokenDataProps = DefaultAppTokenDataProps & {
  siloAddress: string;
};

export type SpTokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceSpTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  SpTokenDataProps,
  SpTokenDefinition
> {
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

  async getDefinitions(): Promise<SpTokenDefinition[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinitions(this.network);
    if (!markets) return [];

    return markets.flatMap(market =>
      market.marketAssets.map(marketAsset => ({
        siloAddress: market.siloAddress,
        address: marketAsset.spToken,
      })),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams<SpTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, SpTokenDataProps, SpTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }
}
