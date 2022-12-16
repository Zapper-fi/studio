import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import _ from 'lodash';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { MuxContractFactory } from '~apps/mux';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

interface ReaderAssets {
  symbol: string;
  id: number;
  tokenAddress: string;
  decimals: number;
  isStable: boolean;
  isTradable: boolean;
  isOpenable: boolean;
  useStableTokenForProfit: boolean;
  isEnabled: boolean;
  minProfitTime: number;
  minProfitRate: BigNumber;
}

interface BaseTokenWithMuxTokenId {
  muxTokenId: number;
  minProfitTime: number;
  minProfitRate: BigNumber;
}

type MuxBaseToken = BaseToken & BaseTokenWithMuxTokenId;

export const _0: BigNumber = new BigNumber('0');
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

export const READER_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0x6e29c4e8095b2885b8d30b17790924f33ecd7b33',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0xeab5b06a1ea173674601dd54c612542b563beca1',
  [Network.AVALANCHE_MAINNET]: '0x5996d4545ee59d96cb1fe8661a028bef0f4744b0',
  [Network.FANTOM_OPERA_MAINNET]: '0x29f4dc996a0219838afecf868362e4df28a70a7b',
};

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

function fromRate(n: number): BigNumber {
  return new BigNumber(n.toString()).shiftedBy(-RATIO_DECIMALS);
}

export function fromWei(n: ethers.BigNumber): BigNumber {
  return new BigNumber(n.toString()).shiftedBy(-DECIMALS);
}

async function getReaderAssets(network: Network, appToolkit: IAppToolkit): Promise<ReaderAssets[]> {
  const multicall = appToolkit.getMulticall(network);
  const readerContract = new MuxContractFactory(appToolkit).muxReader({ address: READER_ADDRESS[network], network });
  const storage = await multicall.wrap(readerContract).callStatic.getChainStorage();

  return storage[1]
    .filter(item => item.tokenAddress !== ZERO_ADDRESS)
    .map(a => {
      return {
        symbol: ethers.utils.parseBytes32String(a.symbol),
        id: a.id,
        tokenAddress: a.tokenAddress,
        decimals: a.decimals,
        isStable: test64(a.flags.toNumber(), ASSET_IS_STABLE),
        isTradable: test64(a.flags.toNumber(), ASSET_IS_TRADABLE),
        isOpenable: test64(a.flags.toNumber(), ASSET_IS_OPENABLE),
        useStableTokenForProfit: test64(a.flags.toNumber(), ASSET_USE_STABLE_TOKEN_FOR_PROFIT),
        isEnabled: test64(a.flags.toNumber(), ASSET_IS_ENABLED),
        minProfitTime: a.minProfitTime,
        minProfitRate: fromRate(a.minProfitRate),
      };
    });
}

export async function getMarketTokensByNetwork(network: Network, appToolkit: IAppToolkit): Promise<MuxBaseToken[]> {
  const baseTokens = await appToolkit.getBaseTokenPrices(network);
  const assets = await getReaderAssets(network, appToolkit);

  return _.compact(
    assets
      .filter(item => !item.isStable && item.isTradable && item.isOpenable && item.isEnabled)
      .map(token => {
        const marketToken = baseTokens.find(x => x.address === token.tokenAddress.toLowerCase());
        if (!marketToken) {
          return;
        }
        return {
          ...marketToken,
          muxTokenId: token.id,
          minProfitTime: token.minProfitTime,
          minProfitRate: token.minProfitRate,
        };
      }),
  );
}

export async function getCollateralTokensByNetwork(network: Network, appToolkit: IAppToolkit): Promise<MuxBaseToken[]> {
  const baseTokens = await appToolkit.getBaseTokenPrices(network);
  const assets = await getReaderAssets(network, appToolkit);

  return _.compact(
    assets
      .filter(item => !item.useStableTokenForProfit && item.isEnabled)
      .map(token => {
        const collateralToken = baseTokens.find(x => x.address === token.tokenAddress.toLowerCase());
        if (!collateralToken) {
          return;
        }
        return {
          ...collateralToken,
          muxTokenId: token.id,
          minProfitTime: token.minProfitTime,
          minProfitRate: token.minProfitRate,
        };
      }),
  );
}

export function computePositionPnlUsd(
  asset: MuxBaseToken,
  amount: BigNumber,
  entryPrice: BigNumber,
  lastIncreasedTime: number,
  isLong: boolean,
): { pendingPnlUsd: BigNumber; pnlUsd: BigNumber } {
  if (amount.eq(_0)) {
    return { pendingPnlUsd: _0, pnlUsd: _0 };
  }
  const priceDelta = isLong ? new BigNumber(asset.price).minus(entryPrice) : entryPrice.minus(asset.price);
  const pendingPnlUsd = priceDelta.times(amount);
  if (
    priceDelta.gt(_0) &&
    Math.ceil(Date.now() / 1000) < lastIncreasedTime + asset.minProfitTime &&
    priceDelta.abs().lt(asset.minProfitRate.times(entryPrice))
  ) {
    return { pendingPnlUsd, pnlUsd: _0 };
  }
  return { pendingPnlUsd, pnlUsd: pendingPnlUsd };
}

export function encodeSubAccountId(
  account: string,
  collateralId: number,
  assetId: number,
  isLong: boolean,
): string | null {
  if (ethers.utils.arrayify(account).length !== 20) {
    return null;
  }
  return (
    ethers.utils.solidityPack(['address', 'uint8', 'uint8', 'bool'], [account, collateralId, assetId, isLong]) +
    '000000000000000000'
  );
}
