import { Inject } from '@nestjs/common';
import dayjs from 'dayjs';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ArborFinanceContractFactory, ArborFinanceBondToken } from '../contracts';
import { BONDS_QUERY, BondHolders } from '../graphql';

export type ArborFinanceBondTokenDefinition = {
  address: string;
  clearingPrice: number;
  maturityDate: number;
};

@PositionTemplate()
export class EthereumArborFinanceBondTokenFetcher extends AppTokenTemplatePositionFetcher<
  ArborFinanceBondToken,
  DefaultAppTokenDataProps,
  ArborFinanceBondTokenDefinition
> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArborFinanceContractFactory) protected readonly contractFactory: ArborFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ArborFinanceBondToken {
    return this.contractFactory.arborFinanceBondToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<ArborFinanceBondTokenDefinition[]> {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<BondHolders>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/alwaysbegrowing/arbor-v1',
      query: BONDS_QUERY,
    });

    return data.bonds.map(v => ({
      address: v.id,
      clearingPrice: v.clearingPrice,
      maturityDate: v.maturityDate,
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<ArborFinanceBondTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<ArborFinanceBondToken>) {
    return [{ address: await contract.collateralToken(), network: this.network }];
  }

  async getPricePerShare({
    definition,
  }: GetPricePerShareParams<ArborFinanceBondToken, DefaultAppTokenDataProps, ArborFinanceBondTokenDefinition>) {
    const m = dayjs.unix(definition.maturityDate);
    const date = dayjs(new Date());
    const yearsUntilMaturity = m.diff(date, 'year', true);
    const ytm = 1 / definition.clearingPrice - 1;
    return yearsUntilMaturity > 0 ? 1 / (1 + ytm) ** yearsUntilMaturity : 1;
  }
}
