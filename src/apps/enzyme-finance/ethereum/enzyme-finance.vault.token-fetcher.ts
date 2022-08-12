import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { DefaultDataProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PriceStageParams,
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

  async getUnderlyingTokenAddresses(contract: EnzymeFinanceVault) {
    return (await contract.getTrackedAssets()).map(x => x.toLowerCase());
  }

  async getPrice({
    appToken,
    contract,
    tokenLoader,
  }: PriceStageParams<EnzymeFinanceVault, DefaultDataProps>): Promise<number> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const decimalsRaw = await this.getDecimals(contract);
    const supplyRaw = await this.getSupply(contract);
    const decimals = new BigNumber(10).exponentiatedBy(decimalsRaw);
    const supply = new BigNumber(supplyRaw.toString()).div(decimals);
    const underlying = await this.getUnderlyingTokenAddresses(contract);

    const tokenDependencies = await tokenLoader
      .getMany(underlying.map(tokenAddressRaw => ({ network, address: tokenAddressRaw.toLowerCase() })))
      .then(deps => compact(deps));

    const totalAssetUnderManagement = _.sum(
      await Promise.all(
        underlying.map(async tokenAddressRaw => {
          const tokenAddress = tokenAddressRaw.toLowerCase();
          const uTokenContract = this.contractFactory.erc20({ address: tokenAddress, network });
          const [tokenAmountRaw, decimals] = await Promise.all([
            multicall.wrap(uTokenContract).balanceOf(appToken.address),
            multicall.wrap(uTokenContract).decimals(),
          ]);

          const amount = Number(tokenAmountRaw) / 10 ** decimals;
          const baseToken = tokenDependencies.find(v => v.address === tokenAddress);
          if (!baseToken) return 0;

          return baseToken.price * amount;
        }),
      ),
    );

    return Number(supply) > 0 ? new BigNumber(totalAssetUnderManagement.toString()).div(supply).toNumber() : 0;
  }

  async getDataProps(opts: DataPropsStageParams<EnzymeFinanceVault, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;
    const isActive = appToken.supply > 0 ? true : false;

    return { liquidity, isActive };
  }
}
