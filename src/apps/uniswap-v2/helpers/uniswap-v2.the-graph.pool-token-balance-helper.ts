import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { keyBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { UniswapV2ContractFactory } from '../contracts';

import { UniswapV2PoolTokenDataProps } from './uniswap-v2.pool.token-helper';

type UniswapV2GetBalancesParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  subgraphUrl: string;
  symbolPrefix: string;
  fee?: number;
  overrideDecimalsForTokens?: string[];
};

type BalanceData = {
  user?: {
    liquidityPositions: {
      liquidityTokenBalance: string;
      pair: {
        id: string;
        reserve0: string;
        reserve1: string;
        reserveUSD: string;
        token0: {
          id: string;
          decimals: string;
          symbol: string;
        };
        token1: {
          id: string;
          decimals: string;
          symbol: string;
        };
        totalSupply: string;
      };
    }[];
  };
};

const GET_BALANCE_QUERY = gql`
  query getBalances($address: String!) {
    user(id: $address) {
      liquidityPositions {
        liquidityTokenBalance
        pair {
          id
          totalSupply
          reserveUSD
          reserve0
          reserve1
          token0 {
            id
            decimals
            symbol
          }
          token1 {
            id
            decimals
            symbol
          }
        }
      }
    }
  }
`;

const rename = (token: string) => {
  const renameTo: Record<string, string> = {
    'yDAI+yUSDC+yUSDT+yTUSD': 'Y Curve',
    'yyDAI+yUSDC+yUSDT+yTUSD': 'yUSD',
    REPv2: 'REP',
    '': 'AAVE',
  };
  if (renameTo[token]) return renameTo[token];
  else return token;
};

@Injectable()
export class UniswapV2TheGraphPoolTokenBalanceHelper {
  constructor(
    @Inject(UniswapV2ContractFactory) private readonly contractFactory: UniswapV2ContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getBalances({
    address,
    network,
    appId,
    groupId,
    subgraphUrl,
    symbolPrefix,
    fee = 0.003,
    overrideDecimalsForTokens = [],
  }: UniswapV2GetBalancesParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const pricesByAddress = keyBy(prices, p => p.address);
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<BalanceData>({
      endpoint: subgraphUrl,
      query: GET_BALANCE_QUERY,
      variables: { address: address.toLowerCase() },
    });

    const balances = await Promise.all(
      (data.user?.liquidityPositions ?? []).map(async lp => {
        const pairAddress = lp.pair.id;
        const contract = this.contractFactory.erc20({ address: pairAddress, network });
        const balanceRaw = await multicall.wrap(contract).balanceOf(address);

        // Resolve the tokens either from our base tokens or from data from TheGraph
        const tokens: BaseToken[] = [lp.pair.token0, lp.pair.token1].map(tokenData => {
          if (pricesByAddress[tokenData.id]) return pricesByAddress[tokenData.id];
          const overrideDecimals = overrideDecimalsForTokens.includes(tokenData.id);
          const decimals = overrideDecimals ? 18 : +tokenData.decimals;
          const symbol = rename(tokenData.symbol === 'WETH' ? 'ETH' : tokenData.symbol);
          return { type: ContractType.BASE_TOKEN, address, network, symbol, decimals, price: 0 };
        });

        // Resolve the reserves. In some cases, these need to be denormalized from TheGraph data
        const reserves = [Number(lp.pair.reserve0), Number(lp.pair.reserve1)].map((reserve, i) => {
          if (!overrideDecimalsForTokens.includes(tokens[i].address)) return reserve;
          return reserve / 10 ** tokens[i].decimals;
        });

        // Resolve token spot prices
        if (tokens[0].price && !tokens[1].price) {
          // If we have the price of one of the tokens, we can infer the price of the other via the reserves
          tokens[1].price = (tokens[0].price * reserves[0]) / reserves[1];
        } else if (!tokens[0].price && tokens[1].price) {
          // Same can be said for the opposite token
          tokens[0].price = (tokens[1].price * reserves[1]) / reserves[0];
        } else if (!tokens[0].price && !tokens[1].price) {
          // In all other cases, rely on the price of the tokens as they stand in the pool.
          const liquidity = Number(lp.pair.reserveUSD);
          tokens[0].price = liquidity / reserves[0] / 2;
          tokens[1].price = liquidity / reserves[1] / 2;
        }

        const decimals = 18;
        const liquidity = tokens[0].price * reserves[0] + tokens[1].price * reserves[1];
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
        const supply = Number(lp.pair.totalSupply);
        const price = liquidity / supply;
        const pricePerShare = [reserves[0] / supply, reserves[1] / supply];
        const volume = 0;
        const volumeChangePercentage = 0;
        const isBlocked = false;

        // Display Props
        const label = `${symbolPrefix} ${tokens[0].symbol} / ${tokens[1].symbol}`;
        const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const images = [getTokenImg(tokens[0].address, network), getTokenImg(tokens[1].address, network)];
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Volume', value: buildDollarDisplayItem(volume) },
          { label: 'Fee', value: buildPercentageDisplayItem(fee) },
        ];

        const poolToken: AppTokenPosition<UniswapV2PoolTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: pairAddress,
          symbol: symbolPrefix,
          decimals,
          supply,
          network,
          appId,
          groupId,
          pricePerShare,
          price,
          tokens,

          dataProps: {
            liquidity,
            fee,
            volume,
            volumeChangePercentage,
            isBlocked,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return drillBalance(poolToken, balanceRaw.toString());
      }),
    );

    return balances;
  }
}
