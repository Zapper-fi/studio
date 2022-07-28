import { Network } from '~types/network.interface';

export const TO_CURVE_NETWORK = {
  [Network.ETHEREUM_MAINNET]: 'ethereum',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.AVALANCHE_MAINNET]: 'avalanche',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.GNOSIS_MAINNET]: 'xdai',
  [Network.HARMONY_MAINNET]: 'harmony',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.POLYGON_MAINNET]: 'polygon',
};

export type GaugeData = {
  swap: string;
  swap_token: string;
  name: string;
  gauge: string;
  type: string;
  gauge_controller: {
    get_gauge_weight: string;
    gauge_relative_weight: string;
    inflation_rate: string;
  };
  gauge_data: {
    working_supply: string;
    inflation_rate: string;
  };
  swap_data: {
    virtual_price: string;
  };
};

export type GetGaugesResponse = {
  success: boolean;
  data: {
    gauges: Record<string, GaugeData>;
    generatedTimeMs: number;
  };
};

export type FactoryGaugeData = {
  gauge: string;
  swap_token: string;
  name: string;
  symbol: string;
  hasCrv: boolean;
  side_chain: boolean;
  is_killed?: boolean;
  type: string;
  gauge_data: {
    working_supply: string;
    totalSupply: string;
    gauge_relative_weight: string;
    get_gauge_weight: string;
    inflation_rate: number;
  };
  swap_data: {
    virtual_price: string;
  };
  lpTokenPrice: number | null;
  swap: string;
  rewardsNeedNudging: boolean;
  areCrvRewardsStuckInBridge: boolean;
  extraRewards: {
    gaugeAddress: string;
    tokenAddress: string;
    tokenPrice: number | null;
    name: string;
    symbol: string;
    decimals: string;
    apy: number;
    metaData: {
      rate: string;
      periodFinish: number;
    };
  }[];
};

export type GetFactoryGaugesResponse = {
  success: boolean;
  data: {
    gauges: FactoryGaugeData[];
    generatedTimeMs: number;
  };
};

export type PoolApyData = {
  type: string;
  address: string;
  volumeUSD: number;
  rawVolume: number;
  latestDailyApy: number | string;
  latestWeeklyApy: number | string;
  virtualPrice: number;
};

export type GetPoolApyDataResponse = {
  success: boolean;
  data: {
    poolList: PoolApyData[];
    totalVolume: number;
    cryptoVolume: number;
    cryptoShare: number;
    generatedTimeMs: number;
  };
};
