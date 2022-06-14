import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EulerContractFactory } from '~apps/euler';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const groupId = EULER_DEFINITION.groups.eToken.id;
const network = Network.ETHEREUM_MAINNET;

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        id
        interestRate
        borrowAPY
        supplyAPY
        totalSupply
        twap
        name
        symbol
        decimals
        eTokenAddress
        totalBalances
      }
    }
  }
`;

interface EulerMarket {
  id: string;
  interestRate: string;
  borrowAPY: string;
  supplyAPY: string;
  totalSupply: string;
  twap: string;
  name: string;
  symbol: string;
  decimals: string;
  eTokenAddress: string;
  totalBalances: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEulerETokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) private readonly eulerContractFactory: EulerContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async market => {
        if (market.eTokenAddress === ZERO_ADDRESS) return null;

        const eTokenContract = this.eulerContractFactory.eulerEtokenContract({
          address: market.eTokenAddress,
          network,
        });

        const [totalSupplyRaw, decimals] = await Promise.all([
          multicall.wrap(eTokenContract).totalSupply(),
          multicall.wrap(eTokenContract).decimals(),
        ]);
        const underlyingToken = baseTokens.find(token => token.address === market.id.toLowerCase());
        if (totalSupplyRaw.isZero() || !underlyingToken) return null;

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const symbol = `E${market.symbol}`;
        const price = underlyingToken.price;
        const pricePerShare = Number(supply) / Number(market.totalBalances);

        const dataProps = {
          name: `Euler E token ${market.name}`,
          liquidity: supply * underlyingToken.price,
          underlyingAddress: market.id,
          interestRate: Number(market.interestRate) / 10 ** decimals,
          borrowAPY: Number(market.borrowAPY) / 10 ** decimals,
          supplyAPY: Number(market.supplyAPY) / 10 ** decimals,
          totalSupply: supply,
          totalBalances: market.totalBalances,
        };

        const statsItems = [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(dataProps.liquidity),
          },
          {
            label: 'Borrow APY',
            value: buildDollarDisplayItem(dataProps.borrowAPY),
          },
          {
            label: 'Supply APY',
            value: buildDollarDisplayItem(dataProps.supplyAPY),
          },
        ];

        const displayProps = {
          label: `Euler E token ${market.name}`,
          secondaryLabel: buildDollarDisplayItem(price),
          images: getImagesFromToken(underlyingToken),
          statsItems,
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: market.eTokenAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens: [underlyingToken],
          dataProps,
          displayProps,
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
