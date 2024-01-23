import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { OpenleverageViemContractFactory } from '../contracts';
import { OpenleverageLpool } from '../contracts/viem';

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
    @Inject(OpenleverageViemContractFactory) protected readonly contractFactory: OpenleverageViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const data = await gqlFetch<OpenLeveragePoolsResponse>({
      endpoint: this.subgraphUrl,
      query,
    });

    return data.pools.map(v => v.id);
  }

  getContract(address: string) {
    return this.contractFactory.openleverageLpool({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<OpenleverageLpool>) {
    return [{ address: await contract.read.underlying(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OpenleverageLpool>) {
    const exchangeRateCurrentRaw = await contract.read.exchangeRateStored();
    const exchangeRate = Number(exchangeRateCurrentRaw) / 10 ** 18;
    return [exchangeRate];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<OpenleverageLpool>) {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
