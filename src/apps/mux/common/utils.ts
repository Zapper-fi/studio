import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import _ from 'lodash';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  RATIO_DECIMALS,
  DECIMALS,
  READER_ADDRESS,
  ASSET_IS_STABLE,
  ASSET_IS_TRADABLE,
  ASSET_IS_OPENABLE,
  ASSET_USE_STABLE_TOKEN_FOR_PROFIT,
  ASSET_IS_ENABLED,
  _0,
} from '~apps/mux/common/constants';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { MuxViemContractFactory } from '../contracts';

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
  const multicall = appToolkit.getViemMulticall(network);
  const readerContract = new MuxViemContractFactory(appToolkit).muxReader({
    address: READER_ADDRESS[network],
    network,
  });

  const storage = await multicall
    .wrap(readerContract)
    .simulate.getChainStorage()
    .then(v => v.result);

  return storage.assets
    .filter(item => item.tokenAddress !== ZERO_ADDRESS)
    .map(a => ({
      symbol: ethers.utils.parseBytes32String(a.symbol),
      id: a.id,
      tokenAddress: a.tokenAddress,
      decimals: a.decimals,
      isStable: test64(Number(a.flags), ASSET_IS_STABLE),
      isTradable: test64(Number(a.flags), ASSET_IS_TRADABLE),
      isOpenable: test64(Number(a.flags), ASSET_IS_OPENABLE),
      useStableTokenForProfit: test64(Number(a.flags), ASSET_USE_STABLE_TOKEN_FOR_PROFIT),
      isEnabled: test64(Number(a.flags), ASSET_IS_ENABLED),
      minProfitTime: a.minProfitTime,
      minProfitRate: fromRate(a.minProfitRate),
    }));
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
  assetPrice: number,
  assetMinProfitTime: number,
  assetMinProfitRate: string,
  amount: BigNumber,
  entryPrice: BigNumber,
  lastIncreasedTime: number,
  isLong: boolean,
): { pendingPnlUsd: BigNumber; pnlUsd: BigNumber } {
  if (new BigNumber(amount).eq(_0)) return { pendingPnlUsd: _0, pnlUsd: _0 };

  const priceDelta = isLong ? new BigNumber(assetPrice).minus(entryPrice) : new BigNumber(entryPrice).minus(assetPrice);
  const pendingPnlUsd = priceDelta.times(amount);

  const isPendingMinTime = Math.ceil(Date.now() / 1000) < lastIncreasedTime + assetMinProfitTime;
  const isPendingMinProfitRate = priceDelta.abs().lt(new BigNumber(assetMinProfitRate).times(entryPrice));

  if (priceDelta.gt(_0) && isPendingMinTime && isPendingMinProfitRate) return { pendingPnlUsd, pnlUsd: _0 };
  return { pendingPnlUsd, pnlUsd: pendingPnlUsd };
}

export function encodeSubAccountId(account: string, collateralId: number, assetId: number, isLong: boolean) {
  if (ethers.utils.arrayify(account).length !== 20) return null;
  const params = [account, collateralId, assetId, isLong];
  const packed = ethers.utils.solidityPack(['address', 'uint8', 'uint8', 'bool'], params);
  const padded = packed + '000000000000000000';
  return padded;
}
