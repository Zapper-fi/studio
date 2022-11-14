import Axios, { AxiosInstance } from 'axios';
import { ethers } from 'ethers';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MuxContractFactory } from '~apps/mux';
import { LiquidityAsset } from '~apps/mux/helpers/mux.mlp.token-helper';
import { ContractType } from '~position/contract.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

interface ReaderAssets {
  symbol: string;
  tokenAddress: string;
  decimals: number;
  isStable: boolean;
  isTradable: boolean;
  isOpenable: boolean;
  useStableTokenForProfit: boolean;
  isEnabled: boolean;
}

export const DECIMALS = 18;
export const RATIO_DECIMALS = 5;
export const ASSET_IS_STABLE = 0x00000000000001; // is a usdt, usdc, ...
export const ASSET_CAN_ADD_REMOVE_LIQUIDITY = 0x00000000000002; // can call addLiquidity and removeLiquidity with this token
export const ASSET_IS_TRADABLE = 0x00000000000100; // allowed to be assetId
export const ASSET_IS_OPENABLE = 0x00000000010000; // can open position
export const ASSET_IS_SHORTABLE = 0x00000001000000; // allow shorting this asset
export const ASSET_USE_STABLE_TOKEN_FOR_PROFIT = 0x00000100000000; // take profit will get stable coin
export const ASSET_IS_ENABLED = 0x00010000000000; // allowed to be assetId and collateralId
export const ASSET_IS_STRICT_STABLE = 0x01000000000000; // assetPrice is always 1 unless volatility exceeds strictStableDeviation

const invalidAddress = '0x0000000000000000000000000000000000000000';

export const READER_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0x6e29c4e8095b2885b8d30b17790924f33ecd7b33',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0xeab5b06a1ea173674601dd54c612542b563beca1',
  [Network.AVALANCHE_MAINNET]: '0x5996d4545ee59d96cb1fe8661a028bef0f4744b0',
  [Network.FANTOM_OPERA_MAINNET]: '0x29f4dc996a0219838afecf868362e4df28a70a7b',
};

const muxAxios: AxiosInstance = Axios.create({
  baseURL: 'https://app.mux.network',
});

export function formatMetaBaseData(cols: Array<any>, rows: Array<Array<any>>) {
  const keys = cols.map(col => {
    return col.display_name;
  });

  return rows.map(row => {
    const obj: any = {};
    row.map((item, index) => {
      obj[keys[index]] = item;
    });
    return obj;
  });
}

async function getLiquidityAssetPriceMap() {
  const priceMap: Map<string, number> = new Map();
  const { data: liquidityAsset } = await muxAxios.get<LiquidityAsset>('/api/liquidityAsset');
  liquidityAsset.assets.map(asset => {
    priceMap.set(asset.symbol, Number(asset.price));
  });
  return priceMap;
}

function and64(v1: number, v2: number): number {
  const hi = 0x80000000;
  const low = 0x7fffffff;
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 & hi2;
  const l = low1 & low2;
  return h * hi + l;
}

function test64(v1: number, mask: number): boolean {
  return and64(v1, mask) !== 0;
}

async function getReaderAssets(network: Network, appToolkit: IAppToolkit): Promise<ReaderAssets[]> {
  const multicall = appToolkit.getMulticall(network);
  const readerContract = new MuxContractFactory(appToolkit).muxReader({ address: READER_ADDRESS[network], network });
  const storage = await multicall.wrap(readerContract).callStatic.getChainStorage();

  return storage[1]
    .filter(item => item.tokenAddress !== invalidAddress)
    .map(a => {
      return {
        symbol: ethers.utils.parseBytes32String(a.symbol),
        tokenAddress: a.tokenAddress,
        decimals: a.decimals,
        isStable: test64(a.flags.toNumber(), ASSET_IS_STABLE),
        isTradable: test64(a.flags.toNumber(), ASSET_IS_TRADABLE),
        isOpenable: test64(a.flags.toNumber(), ASSET_IS_OPENABLE),
        useStableTokenForProfit: test64(a.flags.toNumber(), ASSET_USE_STABLE_TOKEN_FOR_PROFIT),
        isEnabled: test64(a.flags.toNumber(), ASSET_IS_ENABLED),
      };
    });
}

export async function getMarketTokensByNetwork(network: Network, appToolkit: IAppToolkit): Promise<BaseToken[]> {
  const baseTokens = await appToolkit.getBaseTokenPrices(network);
  const priceMap = await getLiquidityAssetPriceMap();
  const assets = await getReaderAssets(network, appToolkit);

  return assets
    .filter(item => !item.isStable && item.isTradable && item.isOpenable && item.isEnabled)
    .map(token => {
      let marketToken = baseTokens.find(x => x.address === token.tokenAddress);
      if (!marketToken) {
        marketToken = {
          address: token.tokenAddress,
          symbol: token.symbol,
          decimals: token.decimals,
          price: priceMap.get(token.symbol) || 0,
          type: ContractType.BASE_TOKEN,
          network: network,
        };
      }
      return marketToken;
    });
}

export async function getCollateralTokensByNetwork(network: Network, appToolkit: IAppToolkit): Promise<BaseToken[]> {
  const baseTokens = await appToolkit.getBaseTokenPrices(network);
  const priceMap = await getLiquidityAssetPriceMap();
  const assets = await getReaderAssets(network, appToolkit);

  return assets
    .filter(item => !item.useStableTokenForProfit && item.isEnabled)
    .map(token => {
      let collateralToken = baseTokens.find(x => x.address === token.tokenAddress);
      if (!collateralToken) {
        collateralToken = {
          address: token.tokenAddress,
          symbol: token.symbol,
          decimals: token.decimals,
          price: priceMap.get(token.symbol) || 0,
          type: ContractType.BASE_TOKEN,
          network: network,
        };
      }
      return collateralToken;
    });
}
