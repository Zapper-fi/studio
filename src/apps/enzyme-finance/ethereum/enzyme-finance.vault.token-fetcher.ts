import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { DefaultDataProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PriceStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { EnzymeFinanceContractFactory, EnzymeFinanceVault } from '../contracts';
import { ENZYME_FINANCE_DEFINITION } from '../enzyme-finance.definition';

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

const appId = ENZYME_FINANCE_DEFINITION.id;
const groupId = ENZYME_FINANCE_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEnzymeFinanceVaultTokenFetcher extends AppTokenTemplatePositionFetcher<EnzymeFinanceVault> {
  appId = ENZYME_FINANCE_DEFINITION.id;
  groupId = ENZYME_FINANCE_DEFINITION.groups.vault.id;
  network = Network.ETHEREUM_MAINNET;

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
  }: DisplayPropsStageParams<EnzymeFinanceVault, EnzymeFinanceVaultTokenDataProps>): Promise<string> {
    return contract.name();
  }

  async getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<EnzymeFinanceVault>) {
    return (await contract.getTrackedAssets()).map(x => x.toLowerCase());
  }

  async getPrice({ appToken, multicall }: PriceStageParams<EnzymeFinanceVault, DefaultDataProps>): Promise<number> {
    const tokenSelector = this.appToolkit.getBaseTokenPriceSelector({ tags: { network, appId } });
    const baseTokens = await tokenSelector.getAll({ network });

    const totalAssetUnderManagement = _.sum(
      await Promise.all(
        appToken.tokens.map(async token => {
          const uTokenContract = this.contractFactory.erc20({ address: token.address, network });
          const [tokenAmountRaw, decimals] = await Promise.all([
            multicall.wrap(uTokenContract).balanceOf(appToken.address),
            multicall.wrap(uTokenContract).decimals(),
          ]);

          const amount = Number(tokenAmountRaw) / 10 ** decimals;
          const baseToken = baseTokens.find(v => v.address === token.address);
          if (!baseToken) return 0;

          return baseToken.price * amount;
        }),
      ),
    );

    return Number(appToken.supply) > 0
      ? new BigNumber(totalAssetUnderManagement.toString()).div(appToken.supply).toNumber()
      : 0;
  }

  async getDataProps(opts: DataPropsStageParams<EnzymeFinanceVault, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;
    const isActive = appToken.supply > 0 ? true : false;

    return { liquidity, isActive };
  }
}
