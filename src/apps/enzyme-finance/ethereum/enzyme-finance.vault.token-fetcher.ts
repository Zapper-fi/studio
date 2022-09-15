import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
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

export type EnzymeFinanceVaultTokenDataProps = {
  liquidity: number;
  isActive: boolean;
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
    const data = await this.appToolkit.helpers.theGraphHelper.request<EnzymeFinanceVaultsResponse>({ endpoint, query });
    return data.funds.map(v => v.id.toLowerCase());
  }

  getContract(address: string): EnzymeFinanceVault {
    return this.contractFactory.enzymeFinanceVault({ network: this.network, address });
  }

  async getLabel({
    contract,
  }: GetDisplayPropsParams<EnzymeFinanceVault, EnzymeFinanceVaultTokenDataProps>): Promise<string> {
    return contract.name();
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<EnzymeFinanceVault>) {
    return (await contract.getTrackedAssets()).map(x => x.toLowerCase());
  }

  async getPrice({ appToken, multicall }: GetPriceParams<EnzymeFinanceVault, DefaultDataProps>): Promise<number> {
    const totalAssetUnderManagement = _.sum(
      await Promise.all(
        appToken.tokens.map(async token => {
          const uTokenContract = this.contractFactory.erc20({ address: token.address, network: this.network });
          const tokenAmountRaw = await multicall.wrap(uTokenContract).balanceOf(appToken.address);
          const amount = Number(tokenAmountRaw) / 10 ** token.decimals;
          return token.price * amount;
        }),
      ),
    );

    return Number(appToken.supply) > 0
      ? new BigNumber(totalAssetUnderManagement.toString()).div(appToken.supply).toNumber()
      : 0;
  }

  async getDataProps(opts: GetDataPropsParams<EnzymeFinanceVault, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;
    const isActive = appToken.supply > 0 ? true : false;

    return { liquidity, isActive };
  }
}
