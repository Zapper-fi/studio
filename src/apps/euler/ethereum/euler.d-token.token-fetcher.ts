import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EulerContractFactory } from '~apps/euler';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const groupId = EULER_DEFINITION.groups.dToken.id;
const network = Network.ETHEREUM_MAINNET;

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        id
        interestRate
        borrowAPY
        supplyAPY
        totalBalances
        twap
        name
        symbol
        decimals
        dTokenAddress
      }
    }
  }
`;

interface EulerMarket {
  id: string;
  interestRate: string;
  borrowAPY: string;
  supplyAPY: string;
  totalBalances: string;
  twap: string;
  name: string;
  symbol: string;
  decimals: string;
  dTokenAddress: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumEulerDTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
        if (market.dTokenAddress === ZERO_ADDRESS) return null;

        const dTokenContract = this.eulerContractFactory.eulerDtokenContract({
          address: market.dTokenAddress,
          network,
        });

        const [totalSupplyRaw, decimals] = await Promise.all([
          multicall.wrap(dTokenContract).totalSupply(),
          multicall.wrap(dTokenContract).decimals(),
        ]);

        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());
        if (totalSupplyRaw.isZero() || !underlyingToken) return null;

        const supply = Number(market.totalBalances) / 10 ** decimals;
        const symbol = `D${market.symbol}`;
        const price = underlyingToken.price;
        const pricePerShare = 1;
        const liquidity = Number(totalSupplyRaw) * underlyingToken.price;
        const interestRate = Number(market.interestRate) / 10 ** decimals;
        const borrowAPY = (Number(market.borrowAPY) * 100) / 1e27;

        const dataProps = {
          liquidity,
          interestRate,
          borrowAPY,
        };

        const statsItems = [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(dataProps.liquidity),
          },
          {
            label: 'Borrow APY',
            value: buildPercentageDisplayItem(dataProps.borrowAPY),
          },
        ];

        const displayProps = {
          label: `${market.name} (D)`,
          secondaryLabel: buildDollarDisplayItem(price),
          images: getImagesFromToken(underlyingToken),
          statsItems,
        };

        return {
          type: ContractType.APP_TOKEN as const,
          address: market.dTokenAddress,
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
      }),
    );

    return compact(tokens);
  }
}
