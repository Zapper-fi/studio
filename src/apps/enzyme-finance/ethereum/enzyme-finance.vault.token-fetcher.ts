import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';
import { compact } from 'lodash';

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
    portfolio: {
      holdings: {
        asset: {
          id: string;
        };
        amount: number;
      }[];
    };
  }[];
};

const query = gql`
  query fetchEnzymeVaults {
    funds(first: 100, orderBy: investmentCount, orderDirection: desc) {
      id
      portfolio {
        holdings {
          asset {
            id
          }
          amount
        }
      }
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
        const tokenContract = this.enzymeFinanceContractFactory.enzymeFinanceVault({ address: vault.id, network });
        const [name, symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
        ]);

        // Filter only holdings for which we know the underlying asset price
        const validHoldings = vault.portfolio.holdings.filter(
          holding => !!baseTokens.find(v => v.address === holding.asset.id),
        );

        // Sum over the prices
        const totalAssetUnderManagement = _.sumBy(validHoldings, holding => {
          const underlyingToken = baseTokens.find(v => v.address === holding.asset.id);
          if (!underlyingToken) return 0;

          return underlyingToken.price * holding.amount;
        });

        const underlyingTokens = validHoldings.map(token => {
          return baseTokens.find(x => x.address === token.asset.id);
        });

        const supply = Number(supplyRaw) / 10 ** decimals;
        // filtering out vaults without depositors
        if (supply === 0) return null;
        const pricePerShare = 1;
        const price = totalAssetUnderManagement / supply;
        const tokens = compact(underlyingTokens);

        const label = name;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppImg(appId)];
        const dataProps = {};
        const displayProps = { label, secondaryLabel, images };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: vault.id,
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
