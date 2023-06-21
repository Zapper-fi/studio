import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { EnzymeFinanceContractFactory, EnzymeFinanceVault } from '../contracts';

const query = gql`
  query fetchEnzymeVaults {
    funds(first: 250, orderBy: investmentCount, orderDirection: desc) {
      id
    }
  }
`;

type EnzymeFinanceVaultsResponse = {
  funds: {
    id: string;
  }[];
};

@PositionTemplate()
export class EthereumEnzymeFinanceVaultTokenFetcher extends AppTokenTemplatePositionFetcher<EnzymeFinanceVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(EnzymeFinanceContractFactory) private readonly contractFactory: EnzymeFinanceContractFactory,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super(appToolkit);
  }

  async getAddresses(): Promise<string[]> {
    const endpoint = `https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme`;
    const data = await gqlFetch<EnzymeFinanceVaultsResponse>({ endpoint, query });
    return data.funds.map(v => v.id.toLowerCase());
  }

  getContract(address: string): EnzymeFinanceVault {
    return this.contractFactory.enzymeFinanceVault({ network: this.network, address });
  }

  async getLabel({ contract }: GetDisplayPropsParams<EnzymeFinanceVault>): Promise<string> {
    return contract.name();
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<EnzymeFinanceVault>) {
    return (await contract.getTrackedAssets()).map(x => ({ address: x.toLowerCase(), network: this.network }));
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetPricePerShareParams<EnzymeFinanceVault, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const reserves = await Promise.all(
      appToken.tokens.map(async token => {
        const uTokenContract = this.contractFactory.erc20({ address: token.address, network: this.network });
        const reserveRaw = await multicall.wrap(uTokenContract).balanceOf(appToken.address);
        const reserve = Number(reserveRaw) / 10 ** token.decimals;
        return reserve;
      }),
    );

    return reserves.map(r => r / appToken.supply);
  }
}
