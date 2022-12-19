import { Inject, Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import BigNumber from 'bignumber.js';
import request, { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { MuxContractFactory } from '~apps/mux';
import { Cache } from '~cache/cache.decorator';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

type GetMuxMlpTokenParams = {
  network: Network;
  mlpTokenAddress: string;
};

export type LiquidityAsset = {
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

const ASSETS_TOKENS_QUERY = gql`
  {
    assets {
      symbol
      decimal
      tokenAddress
    }
  }
`;

const SUBGRAPH_URL: Partial<Record<Network, string>> = {
  [Network.ARBITRUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-arb',
  [Network.AVALANCHE_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-ava',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-bsc',
  [Network.FANTOM_OPERA_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-ftm',
};

@Injectable()
export class MuxMlpTokenHelper {
  private axios: AxiosInstance = Axios.create({
    baseURL: 'https://app.mux.network',
  });

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${MUX_DEFINITION.id}:${MUX_DEFINITION.groups.mlp.id}:${network}`,
    ttl: 15 * 60,
  })
  private async getAssetsTokens(network: Network) {
    const url = SUBGRAPH_URL[network];
    if (!url) return [];

    const response = await request<TokensResponse>(url, ASSETS_TOKENS_QUERY, {});
    return response.assets ?? [];
  }

  async getTokens({ network, mlpTokenAddress }: GetMuxMlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const mlpTokenContract = this.contractFactory.erc20({ address: mlpTokenAddress, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(mlpTokenContract).symbol(),
      multicall.wrap(mlpTokenContract).decimals(),
      multicall.wrap(mlpTokenContract).totalSupply(),
    ]);

    // Liquidity
    let liquidityBn = new BigNumber(0);
    const priceMap: Map<string, number> = new Map();
    const { data: liquidityAsset } = await this.axios.get<LiquidityAsset>('/api/liquidityAsset');
    liquidityAsset.assets.map(asset => {
      const chainId = NETWORK_IDS[network];
      priceMap.set(asset.symbol, Number(asset.price));
      if (chainId) {
        const liq = asset.liquidityOnChains[chainId];
        liquidityBn = liquidityBn.plus(liq?.value || 0);
      }
    });
    const liquidity = liquidityBn.toNumber();
    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = liquidityAsset.muxLPPrice;

    // Tokens
    const assetsTokens = await this.getAssetsTokens(network);
    const tokensRaw = assetsTokens.map(token => {
      if (token.tokenAddress !== ZERO_ADDRESS) {
        const baseToken = baseTokens.find(baseToken => baseToken.address === token.tokenAddress.toLowerCase());
        if (!baseToken) return null;
        return baseToken;
      }
    });
    const tokens = _.compact(tokensRaw);

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getAppAssetImage('mux', 'MUXLP')];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

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
        liquidity,
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
