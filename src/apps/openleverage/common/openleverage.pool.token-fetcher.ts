import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { OpenleverageContractFactory, OpenleverageLpool } from '../contracts';
import { OpenleveragePoolAPYHelper } from '../helpers/openleverage-pool.apy-helper';

type OpenLeveragePoolsResponse = {
  pools: {
    id: string;
  }[];
};

const query = gql`
  query fetchPools {
    pools(first: 1000) {
      id
    }
  }
`;

export abstract class OpenleveragePoolTokenFetcher extends AppTokenTemplatePositionFetcher<OpenleverageLpool> {
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpenleveragePoolAPYHelper)
    private readonly openleveragePoolAPYHelper: OpenleveragePoolAPYHelper,
    @Inject(OpenleverageContractFactory) protected readonly contractFactory: OpenleverageContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const data = await this.appToolkit.helpers.theGraphHelper.request<OpenLeveragePoolsResponse>({
      endpoint: this.subgraphUrl,
      query,
    });

    return data.pools.map(v => v.id);
  }

  getContract(address: string) {
    return this.contractFactory.openleverageLpool({ address, network: this.network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<OpenleverageLpool>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OpenleverageLpool>) {
    const exchangeRateCurrent = await contract.exchangeRateStored();
    return Number(exchangeRateCurrent) / 10 ** 18;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<OpenleverageLpool>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<OpenleverageLpool>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ appToken }: GetDataPropsParams<OpenleverageLpool>) {
    const poolDetailMap = await this.openleveragePoolAPYHelper.getApy();
    return (poolDetailMap[appToken.address]?.lendingYieldY || 0) * 100;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<OpenleverageLpool>) {
    const poolDetailMap = await this.openleveragePoolAPYHelper.getApy();
    return getLabelFromToken(appToken.tokens[0]) + '/' + poolDetailMap[appToken.address]?.token1Symbol;
  }
}
