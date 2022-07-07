import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EnzymeFinanceContractFactory } from '../contracts';
import { ENZYME_FINANCE_DEFINITION } from '../enzyme-finance.definition';

type EnzymeFinanceVaultsResponse = {
  funds: {
    id: string;
  }[];
};

const query = gql`
  query fetchEnzymeVaults {
    funds(first: 250, orderBy: investmentCount, orderDirection: desc) {
      id
    }
  }
`;

const appId = ENZYME_FINANCE_DEFINITION.id;
const groupId = ENZYME_FINANCE_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEnzymeFinanceVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(EnzymeFinanceContractFactory) private readonly enzymeFinanceContractFactory: EnzymeFinanceContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedPoolAddresses() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme`;
    const data = await this.appToolkit.helpers.theGraphHelper.request<EnzymeFinanceVaultsResponse>({ endpoint, query });
    return data.funds.map(v => v);
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const poolAddresses = await this.getCachedPoolAddresses();

    const tokens = await Promise.all(
      poolAddresses.map(async vault => {
        const vaultAddress = vault.id.toLowerCase();
        const tokenContract = this.enzymeFinanceContractFactory.enzymeFinanceVault({ address: vaultAddress, network });
        const [name, symbol, decimals, supplyRaw, trackedAssetAddresses] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
          multicall.wrap(tokenContract).getTrackedAssets(),
        ]);

        const totalAssetUnderManagement = _.sum(
          await Promise.all(
            trackedAssetAddresses.map(async tokenAddressRaw => {
              const tokenAddress = tokenAddressRaw.toLowerCase();
              const uTokenContract = this.enzymeFinanceContractFactory.erc20({ address: tokenAddress, network });
              const [tokenAmountRaw, decimals] = await Promise.all([
                multicall.wrap(uTokenContract).balanceOf(vaultAddress),
                multicall.wrap(uTokenContract).decimals(),
              ]);

              const amount = Number(tokenAmountRaw) / 10 ** decimals;
              const baseToken = baseTokens.find(v => v.address === tokenAddress);
              if (!baseToken) return 0;

              return baseToken.price * amount;
            }),
          ),
        );

        const underlyingTokens = trackedAssetAddresses.map(token => {
          return baseTokens.find(x => x.address === token.toLowerCase());
        });

        const supply = Number(supplyRaw) / 10 ** decimals;
        // filtering out vaults without depositors
        if (supply === 0) return null;
        const pricePerShare = 1;
        const price = totalAssetUnderManagement / supply;
        const tokens = compact(underlyingTokens);
        const liquidity = price * supply;

        const label = name;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppImg(appId)];
        const dataProps = { liquidity };
        const displayProps = {
          label,
          secondaryLabel,
          images,
          statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: vaultAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
          dataProps,
          displayProps,
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
