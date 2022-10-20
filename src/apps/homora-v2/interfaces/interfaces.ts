import BigNumber from 'bignumber.js';

import { Exchange, Poolstatus, PoolType, SafeboxStatus, UniswapV3Range, WTokenType } from './enums';

export type IExchange = {
  name: Exchange;
  logo: string;
  spellAddress: string;
  stakingAddress?: string;
  reward: {
    tokenName: string;
    rewardTokenAddress: string;
  };
};

export type Pool = {
  key: string; // /utils/poolKey/ getPoolId(Pool)
  name: string;
  tokens: string[];
  lpTokenAddress: string;
  poolAddress?: string;
  wTokenAddress: string;
  exchange: IExchange;
  type: PoolType;
  color?: string;
  logo?: string;
  logoSize?: number;
  pid?: number;
  gid?: number;
  rewardSymbol?: string;
  rewardAddress?: string;
  poolContractAbi?: Record<string, unknown>;
  curveGaugeAddress?: string;
  curveGaugeControllerAddress?: string;
  curveRawStatsApiUrl?: string;

  isFarmingDisabled?: boolean; // Hide on dashboard + migration page but still show on your position
  status?: Poolstatus; // undefined is mean `normal`
  delistedTimestamp?: number; // delisted timestamp *millisecond*

  // temp for disable borrowing only
  isPoolAvailableV1?: boolean;
  wTokenType: WTokenType;
  stakingAddress?: string;
  spellAddress?: string;
  migrateTo?: string;

  // for WTokenType = WMasterChefJoeV3
  rewardText?: string;

  // for Uniswap V3
  uniswapV3Info?: UniswapV3PoolInfo;

  // launch timestamp *UTC* *Second*
  launchTimestamp?: number;

  // BeethovenX Info
  beetxPoolInfo?: {
    vaultPoolId: string;
  };
};

export type Safebox = {
  address: string;
  safeboxAddress: string;
  cyTokenAddress: string;
  status?: SafeboxStatus; // undefined is mean `normal`
  ibStakingReward?: string;
};

/**
 * Uniswap V3
 */

export type TickInfo = {
  tick: number;
  price0: BigNumber; // price of Token0 in Token1
  price1: BigNumber; // price of Token1 in Token0
  price0Usd?: BigNumber;
  price1Usd?: BigNumber;
};

export type PriceRange = {
  lower: TickInfo;
  upper: TickInfo;
  apr: number;
  name: UniswapV3Range;
};

type SafePriceRange = PriceRange;
type NeutralPriceRange = PriceRange;
type RiskyPriceRange = PriceRange;

export type PriceRanges = [SafePriceRange, NeutralPriceRange, RiskyPriceRange];

export type PriceRangeInfo = {
  lastUpdatedTimestamp: number;
  lastUpdatedTick: number;
  priceRanges: PriceRanges;
};

export type FeeBps = 100 | 500 | 3000 | 10000;
type SafeBps = number;
type NeutralBps = number;
type RiskyBps = number;

export interface UniswapV3PoolInfo extends PriceRangeInfo {
  priceRatioBps: [SafeBps, NeutralBps, RiskyBps]; // 1 BPS = 0.0001 times = 0.01%, 100% = 10000 BPS
  poolFeeBps: FeeBps; // 1 BPS = 0.0001 times = 0.01%, 100% = 10000 BPS
  tickSpacing: 1 | 10 | 60 | 200;
}

export type HomoraV2FarmingPositionDefinition = {
  address: string;
  poolAddress: string;
  tokenAddresses: string[];
  poolName: string;
  exchange: string;
  tradingVolume: number;
  feeTier?: number;
  rewardAddress?: string;
};

export type HomoraV2FarmingPositionDataProps = {
  tradingVolume: number;
  poolAddress: string;
  feeTier?: number;
};

export type HomoraV2LendingPositionDefinition = {
  tokenAddress: string;
  safeboxAddress: string;
  address: string;
};

export type HomoraV2LendingPositionDataProps = {
  supply: number;
  borrow: number;
  utilization: string;
  liquidity: number;
  reserves: number[];
  apy: number;
};
