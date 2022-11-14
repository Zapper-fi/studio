import {Inject, Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import BigNumber from 'bignumber.js';
import request, {gql} from 'graphql-request';
import _ from 'lodash';

import {APP_TOOLKIT, IAppToolkit} from '~app-toolkit/app-toolkit.interface';
import {buildDollarDisplayItem} from '~app-toolkit/helpers/presentation/display-item.present';
import {MuxContractFactory} from '~apps/mux';
import {ContractType} from '~position/contract.interface';
import {AppTokenPosition, Token} from '~position/position.interface';
import {Network, NETWORK_IDS} from '~types/network.interface';

import {MUX_DEFINITION} from '../mux.definition';

type GetMuxMlpTokenParams = {
  network: Network;
  subgraphUrl: string;
  mlpTokenAddress: string;
};

type LiquidityAsset = {
  muxLPPrice: number;
  assets: Asset[];
};

type Asset = {
  symbol: string;
  price: number;
  liquidityOnChains: LiquidityOnChains;
};

type LiquidityOnChains = {
  [chainId: string]: {
    value: number;
  };
};

type TokensResponse = {
  assets?: {
    symbol: string;
    decimal: number;
    tokenAddress: string;
  }[];
};

const assetsTokensQuery = gql`
  {
    assets {
      symbol
      decimal
      tokenAddress
    }
  }
`;
const invalidAddress = '0x0000000000000000000000000000000000000000';

@Injectable()
export class MuxMlpTokenHelper {
  private axios: AxiosInstance = Axios.create({
    baseURL: 'https://app.mux.network',
  });

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  private static async getAssetsTokens(url: string) {
    const response = await request<TokensResponse>(url, assetsTokensQuery, {});
    return response.assets ?? [];
  }

  async getTokens({ network, subgraphUrl, mlpTokenAddress }: GetMuxMlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const mlpTokenContract = this.contractFactory.erc20({ address: mlpTokenAddress, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(mlpTokenContract).symbol(),
      multicall.wrap(mlpTokenContract).decimals(),
      multicall.wrap(mlpTokenContract).totalSupply(),
    ]);

    // Liquidity
    let liquidity = new BigNumber(0);
    const priceMap: Map<string, number> = new Map();
    const { data: liquidityAsset } = await this.axios.get<LiquidityAsset>('/api/liquidityAsset');
    liquidityAsset.assets.map(asset => {
      const chainId = NETWORK_IDS[network];
      priceMap.set(asset.symbol, Number(asset.price));
      if (chainId) {
        const liq = asset.liquidityOnChains[chainId];
        liquidity = liquidity.plus(liq?.value || 0);
      }
    });
    const liquidityNumber = liquidity.toNumber();
    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = liquidityAsset.muxLPPrice;

    // Tokens
    const assetsTokens = await MuxMlpTokenHelper.getAssetsTokens(subgraphUrl);
    const tokensRaw = assetsTokens.map(token => {
      if (token.tokenAddress !== invalidAddress) {
        const t = baseTokens.find(baseToken => baseToken.address === token.tokenAddress.toLowerCase());
        if (!t) {
          return {
            address: token.tokenAddress,
            symbol: token.symbol,
            decimals: token.decimal,
            price: priceMap.get(token.symbol) || 0,
            type: ContractType.BASE_TOKEN,
            network: network,
          };
        }
        return t;
      }
    });
    const tokens = _.compact(tokensRaw) as Token[];

    // Display Props
    const imgUrl = 'https://mux-world.github.io/assets/img/tokens/MUXLP.svg';
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [imgUrl];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidityNumber) }];

    const mlpToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: mlpTokenAddress,
      appId: MUX_DEFINITION.id,
      groupId: MUX_DEFINITION.groups.mlp.id,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare: [],
      tokens,

      dataProps: {
        liquidity: liquidityNumber,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [mlpToken];
  }
}
